import re,sys,subprocess,os,struct,math
from os import listdir
from os.path import isfile, join
from multiprocessing.dummy import Pool as ThreadPool

max_w = 50 #Max length of vocabulary entries

def getVectorData(filename):
    f = open(filename,"rb")
    words = int(f.read(4))
    size = int(f.read(4))
    vocab = [" "] * (words * max_w)
    M = []
    for b in range(0,words):
        a = 0
        while True:
            c = f.read(1)
            vocab[b * max_w + a] = c;
            if len(c) == 0 or c == ' ':
                break
            if (a < max_w) and vocab[b * max_w + a] != '\n':
                a += 1
        tmp = list(struct.unpack("f"*size,f.read(4 * size)))
        length = math.sqrt(sum([tmp[i] * tmp[i] for i in range(0,len(tmp))]))
        for i in range(0,len(tmp)):
            tmp[i] /= length
        M.append(tmp)
        
    f.close()
    return (("".join(vocab)).split(),M)

def makevector(vocabulary,vecs,sequence):
    words = sequence.split()
    indices = []
    for word in words:
        if word not in vocabulary:
            #print("Missing word in vocabulary: " + word)
            continue
            #return [0.0]*len(vecs[0])
        indices.append(vocabulary.index(word))
    #res = map(sum,[vecs[i] for i in indices])
    res = None
    for v in [vecs[i] for i in indices]:
        if res == None:
            res = v
        else:
            res = [x + y for x, y in zip(res,v)]
    length = math.sqrt(sum([res[i] * res[i] for i in range(0,len(res))]))
    for i in range(0,len(res)):
        res[i] /= length
    return res

nameFieldPattern = re.compile("\\|(.*?)\\|.*?",re.IGNORECASE|re.DOTALL)
manaCostPattern = re.compile("(\\{.*?\\})",re.IGNORECASE|re.DOTALL)
def sanitizeInput(cardline):
    nameMatch = nameFieldPattern.search(cardline)
    if nameMatch:
        cardline = cardline.replace(nameMatch.group(1),"") #Eliminate the name.
    cardline = cardline.replace("|"," ") #And then eliminate all the field delimiting bars.

    needsPadding = [",",".","\\",":","[","]","~","/","\"",";"]
    for symbol in needsPadding:
        cardline = cardline.replace(symbol, " " + symbol + " ")
    mcosts = re.findall(manaCostPattern,cardline)
    for match in mcosts:
        cardline = cardline.replace(match," ".join(match))
    return (nameMatch.group(1),cardline)

def convertEncodedCorpusForTraining(filename="src\script\corpus_encoded.txt",outname="src/script/convertedcorpus.txt"):
    f = open(filename)
    outputFile = open(outname,'w')
    for cardline in f:
        if "|" in cardline: #Skip if it's an empty line
            outputFile.write(sanitizeInput(cardline)[1] + "\n")
    f.close()
    outputFile.close()

def getOriginalCardVectors(filename="src/script/corpus_encoded.txt",vectorFileName="src/script/vectors_cbow.bin"):
    cards = open(filename)
    (vocab,vecs) = getVectorData(vectorFileName)
    outvecs = []
    for cardline in cards:
        if "|" in cardline:
            (name,cleanline) = sanitizeInput(cardline)
            outvecs.append((name,makevector(vocab,vecs,cleanline)))
    cards.close()
    return (vocab,vecs,outvecs)

def cosine_similarity(v1,v2):
    #compute cosine similarity of v1 to v2: (v1 dot v1)/{||v1||*||v2||)
    sumxx, sumxy, sumyy = 0, 0, 0
    for i in range(len(v1)):
        x = v1[i]; y = v2[i]
        sumxx += x*x
        sumyy += y*y
        sumxy += x*y
    return sumxy/math.sqrt(sumxx*sumyy)

#For showcasing purposes
def getDistanceStats(originalvecs):
    distances = []
    for i in range(len(originalvecs)):
        for j in range(len(originalvecs)):
            if i < j:
                distances.append(cosine_similarity(originalvecs[i][1],originalvecs[j][1]))
    print("min: " + str(min(distances)))
    print("max: " + str(max(distances)))
    print("avg: " + str(sum(distances) / len(distances)))

def getCardMatches(vecdata,cardline,n=160):
    (vocab,vecs,cardvecs) = vecdata
    (name,cleanline) = sanitizeInput(cardline)
    cardvec = makevector(vocab,vecs,cleanline)
    comparisons = [(cosine_similarity(cardvec,v),name) for (name,v) in cardvecs]
    comparisons.sort()
    for i in range(n):
        print(str(i) + ", " + str(comparisons[len(comparisons)-1-i]))

def addVectors(v0,v1):
    res = [v0[i] + v1[i] for i in range(len(v0))]
    length = math.sqrt(sum([res[i] * res[i] for i in range(0,len(res))]))
    for i in range(0,len(res)):
        res[i] /= length
    return res

def scaleVector(v,k):
    res = [v[i] * k for i in range(len(v))]
    return res

def combineCards(vecdata,cardLineA,cardLineB,scaleFactorA=1.0,scaleFactorB=1.0,matchN=10,getMatches=True):
    vocab,vecs,cardvecs = vecdata
    #vecA = scaleVector(makevector(vocab,vecs,sanitizeInput(cardLineA)[1]),scaleFactorA) #Not good!
    vecA = scaleVector(makevector(vocab,vecs,cardLineA),scaleFactorA)
    #vecB = scaleVector(makevector(vocab,vecs,sanitizeInput(cardLineB)[1]),scaleFactorB) #Not good!
    vecB = scaleVector(makevector(vocab,vecs,cardLineB),scaleFactorB) 
    vecC = addVectors(vecA,vecB)
    if getMatches:
        #print("Closest matches are...")
        print("{\"resultCards\":[")
        comparisons = [(cosine_similarity(vecC,v),name) for (name,v) in cardvecs]
        comparisons.sort()
        for i in range(matchN):
            if(i+1 != matchN):
                print((("{" + str(comparisons[len(comparisons)-1-i]).replace("(", "\"deviation\":").replace(",",",\"cardname\":", 1).replace(")","") + "},").replace(": '", ": \"")).replace("'}", "\"}"))
            else: # Have to account for json's "last item has no comma" stuff.
                print((("{" + str(comparisons[len(comparisons)-1-i]).replace("(", "\"deviation\":").replace(",",",\"cardname\":", 1).replace(")","") + "}").replace(": '", ": \"")).replace("'}", "\"}"))
        print("]}")
    return vecC

def getCardTable(corpusFileName="src/script/corpus_encoded.txt"):
    table = {}
    cf = open(corpusFileName,'r')
    for line in cf:
        nameMatch = nameFieldPattern.search(line)
        if nameMatch:
            name,cardline = sanitizeInput(line)
            table[name] = cardline
    cf.close()
    return table

pool = ThreadPool(4)

vecdata = getOriginalCardVectors()

table = getCardTable()
str1 = table[str(sys.argv[1])]
str2 = table[str(sys.argv[2])]
scaleB = float(sys.argv[3])
scaleA = 1 - scaleB
combineCards(vecdata,str1,str2,scaleA,scaleB);



            


    
    

