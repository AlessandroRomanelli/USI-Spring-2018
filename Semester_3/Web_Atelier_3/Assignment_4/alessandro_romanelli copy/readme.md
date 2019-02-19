# Alessandro Romanelli
___

### Web Atelier &mdash; Assignment 4

### Optional Features
1. **File Statistics** &ndash; Accessibile from route `/stats?file=*.txt|.html` returns the word count of the requested file.
2. **Tag Cloud** &ndash; Accessible from route `/cloud?file=*` will display a Tag Cloud made by the words of the file: more frequent words are more prominent.
3. **JSON Tag Cloud** &ndash; When the client sends an `Accept : application/json` header, a JSON will be sent back by the server instead of the HTML file.