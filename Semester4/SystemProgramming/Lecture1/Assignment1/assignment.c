//
//  assignment.c
//  Assignment 1
//
//  Created by Alessandro Romanelli on 21.02.19.
//  Copyright © 2019 Alessandro Romanelli. All rights reserved.
//

#include <stdio.h>
#include <ctype.h>

int main() {
    char c;
    char lastchar = ' ';
    int count = 0;
    while ((c = getchar()) != EOF) {
        if (!isspace(c) && isspace(lastchar)) {
            count++;
        }
        lastchar = c;
    };
    printf("\n%d", count);
    return count;
}


    
