import string

word_to_count= input("Enter a word you want to count: ")
wordcount = 0

for line in open("PythonSummary.txt"):
    words = line.split()
    for word in words: 
        sub_words = word.split('-')
        for sub_word in sub_words:
            clean_word = sub_word.strip(string.punctuation)
            if clean_word.lower() == word_to_count.lower(): 
                wordcount +=1

print("The word ", word_to_count, " appears ", wordcount, " times in the file")

