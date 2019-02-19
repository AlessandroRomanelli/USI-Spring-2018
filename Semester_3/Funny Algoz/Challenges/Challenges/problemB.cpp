//
//  problem 2.cpp
//  Challenges
//
//  Created by Alessandro Romanelli on 09.10.18.
//  Copyright © 2018 Alessandro Romanelli. All rights reserved.
//

#include <iostream>
using namespace std;

int main() {
    int n;
    int m;
    cin >> n;
    cin >> m;
    
    if (n > m) {
        int temp = n;
        n = m;
        m = temp;
    };
    
    for (int i = n; i <= m; ++i) {
        cout << (i+1) << endl;
    };
}
