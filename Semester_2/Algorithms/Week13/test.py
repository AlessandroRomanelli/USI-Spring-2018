def longest_palindrome(string):
    n = len(string)

    matrix = []
    for _ in range(n):
        matrix.append([])
    for i in range(n):
        for j in range(n):
            if i == j:
                matrix[i].append(1)
            else:
                matrix[i].append(0)

    for subseq_len in range(2, n+1):
        n_of_subseq = n - subseq_len + 1
        for i in range(0, n_of_subseq):
            j = i + subseq_len - 1
            if subseq_len == 2 and string[i] == string[j]:
                matrix[i][j] = 2
            elif string[i] == string[j]:
                matrix[i][j] = matrix[i+1][j-1] + 2
            else:
                left = matrix[i+1][j]
                right = matrix[i][j-1]
                matrix[i][j] = max(left, right)
    return matrix[0][n-1]

print(longest_palindrome(input()))
