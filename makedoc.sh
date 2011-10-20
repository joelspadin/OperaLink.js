#I use Cygwin. This makes shell scripts runnable.
source ~/.bash_profile

wdir="`pwd`"
operalink="$wdir/src/script/operalink.js"
winpath="`cygpath -w \"$operalink\"`"

rm -rf ./jsdoc


echo "$winpath"
#If you want to use this script, change this to the location of JSDoc
#pushd /c/Users/spadija/Programs/Programming/JSDoc3
#cp "$operalink" .

#rm -rf ./out

#java -jar jsrun.jar app/run.js -a -t=templates/jsdoc operalink.js
#rm operalink.js

#cp -r ./out/jsdoc "$wdir/"

#popd

/c/Users/Joel/Programs/Programming/JSDoc3/jsdoc.sh "$winpath"
