# def find_largest(A):
#     if (len(A) == 1):
#         return A[0]
#     n = len(A)
#     middle = n // 2
#     maxLeft = find_largest(A[middle:])
#     maxRight = find_largest(A[:middle])
#     if maxLeft < maxRight:
#         return maxRight
#     else:
#         return maxLeft
#
# A = [1,7,3,25,8,4,8,2,1,7,10]
#
# print(find_largest(A))

# def partition_even_odd(A):
#     i = 0
#     j = len(A)-1
#     for k in range(len(A)):
#         if A[k] % 2 == 0:
#             while A[i] % 2 == 0:
#                 i+=1
#             A[i], A[k] = A[k], A[i]
#         else:
#             while A[j] % 2 != 0:
#                 j-=1
#             A[j], A[k] == A[k], A[j]
#     return A
#
#
# A = [1,2,3,4,5,6,7,8,9]
#
# print(partition_even_odd(A))


# import pprint
#
# pp = pprint.PrettyPrinter(indent=2)
#
# def exercise_26a(A, x):
#     n = len(A)
#     matrix = []
#
#     for i in range(n):
#         line = []
#         for j in range(n):
#             line.append(0)
#         matrix.append(line)
#
#     for i in range(n):
#         matrix[i][i] = A[i]
#
#     for length in range(2, n+1):
#         for i in range(n-length+1):
#             j = i + length - 1;
#             partial = 0
#             for k in range(i, j+1):
#                 partial += A[k]
#             matrix[i][j] = partial
#             if partial == x:
#                 return True
#     pp.pprint(matrix)
#     return False
#
# pp.pprint(exercise_26a([1,2,4,9], 5))
#
# def exercise_26b(A, x):
#     n = len(A)
#     if n == 0:
#         return False
#     if A[0] - x == 0:
#         return True
#     return exercise_26b(A[1:], x) or exercise_26b(A[1:], x-A[0])
#
# pp.pprint(exercise_26b([1,2,4,9], 5))

# def linear_algo_x(A):
#     x = 0
#     i = 0
#     j = 1
#     minimum = maximum = A[i]
#     while j < len(A):
#         if A[j] >= A[i]:
#             maximum = A[j]
#             if maximum - minimum > x:
#                 x = maximum - minimum
#         else:
#             i = j
#             minimum = maximum = A[i]
#         j+= 1
#     return x
#
# A = [3,5,1,2,1,0,3,9,10,15]
# print(linear_algo_x(A))

# def LIS(A):
#     if len(A) < 2:
#         return A
#     left = LIS_H(A[1:], [A[0]])
#     right = LIS_H(A[1:], [])
#     return max(left, right)
#
# def LIS_H(A,B):
#     print(A)
#     print(B)
#     if len(A) == 0:
#         return B
#     if len(A) > 0 and len(B) > 0 and B[-1] < A[0]:
#         return LIS_H(A[1:], B + [A[0]])
#     else:
#         return LIS_H(A[1:], B)
#
#
# print(LIS([1,6,3,2,1,8,5,3,9,10,11]))
#
# import pprint
#
# pp = pprint.PrettyPrinter()
#
# def LIS(A):
#     n = len(A)
#     matrix = []
#
#     for i in range(n):
#         line = []
#         for j in range(n):
#             line.append(0)
#         matrix.append(line)
#
#     for i in range(n):
#         matrix[i][i] = 1
#
#     for length in range(2, n+1):
#         for i in range(n-length+1):
#             j = i + length - 1;
#             left = matrix[i-1][j]
#             right = matrix[i][j-1]
#             if A[i] < A[i+1]:
#                 left += 1
#             if A[j] > A[j-1]:
#                 right += 1
#             matrix[i][j] = max(left, right)
#
#
#     pp.pprint(matrix)
#
# pp.pprint(LIS([2,3,0,9,6,1]))

# import pprint
# import copy
#
# pp = pprint.PrettyPrinter()
#
# def LIS(A):
#     n = len(A)
#     matrix = []
#
#     for i in range(n):
#         line = []
#         for j in range(n):
#             line.append([])
#         matrix.append(line)
#
#     for i in range(n):
#         matrix[i][i] = [A[i]]
#
#     for length in range(2, n+1):
#         for i in range(n-length+1):
#             j = i + length - 1;
#             left = copy.copy(matrix[i][j-1])
#             right = copy.copy(matrix[i+1][j])
#             if A[i] <= right[0]:
#                 right = [A[i]] + right
#             if A[j] >= left[-1]:
#                 left += [A[j]]
#             # print(max(left,right))
#             matrix[i][j] = max(left, right)
#     return matrix#[0][len(A)-1]
#
# pp.pprint(LIS([11,0,9,11,12]))
