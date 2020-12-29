import random
f = "lucky.txt"
a = 25
with open(f,"w") as file:
    for i in range(a):
        file.write(str(random.uniform(4, 10)) + ","+str(random.uniform(5, 10)) +"\n")
    for i in range(a):
        file.write(str(random.uniform(8, 15)) + ","+str(random.uniform(8, 12)) +"\n")