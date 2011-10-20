# This only works with Cygwin
wdir="`pwd`"
operalink="$wdir/src/script/operalink.js"
winpath="`cygpath -w \"$operalink\"`"

rm -rf ./jsdoc

# jsdoc.sh is a script that runs the given file through JSDoc, then 
# copies the output folder to ./jsdoc
/c/Users/Joel/Programs/Programming/JSDoc3/jsdoc.sh "$winpath"
