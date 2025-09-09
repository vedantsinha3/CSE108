sentence = input("Enter a sentence: ")
repeat = int(input("Enter a number: "))


filename = f"CompletedPunishment{repeat}.txt"

with open(filename, 'w') as file: 
    for i in range(repeat):
        file.write(sentence + "\n")

print(f"Punishment completed and saved to {filename}")

