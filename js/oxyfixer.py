import os
import numpy
script_dir = os.path.dirname(__file__)
rel_path = 'oxygen-calc.js'
abs_file_path = os.path.join(script_dir, rel_path)
with open(abs_file_path) as file:
    lines = file.readlines()
"""test"""
newlines = []
indent = 0
count = 0
blockword = ('function', 'if', 'for', 'elif', 'else', 'try', 'catch', 'while')
for line in lines:
    newlines.append(line)
    #if line.strip().startswith('//'):
    #    continue
    if len(line.strip()) == 0:
        continue
    if count > 0 and not line.startswith("\t"*count):
        newlines.pop()
        amountsub = count-line.count('\t')
        for i in range(amountsub):
            count -= 1
            newlines.append("\t"*count + "}\n")
        newlines.append(line)

    if line.strip().startswith(blockword):
        count += 1

with open(os.path.join(script_dir, 'oxygen-calc-1.js'), mode='w') as file:
    file.writelines(newlines)