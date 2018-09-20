def longestPalyndrome(string):
    s_length = len(string)

    lengths = []
    for i in range(s_length):
        lengths.append([])
        for j in range(s_length):
            if i == j:
                lengths[i].append(1)
            else:
                lengths[i].append(0)
    for line in lengths:
        print(line)
    print('\n\n')
    for sublength in range(2, s_length+1):

        for i in range(s_length - sublength + 1):
            j = i+ sublength -1
            if sublength == 2 and string[i] == string[j]:
                lengths[i][j] = 2
            elif string[i] == string[j]:
                lengths[i][j] = lengths[i+1][j-1] + 2
            else:
                lengths[i][j] = max(lengths[i][j-1], lengths[i+1][j]);
        for line in lengths:
            print(line)
        print('\n\n')

    return lengths[0][s_length-1]

string = input()
print(longestPalyndrome(string))
