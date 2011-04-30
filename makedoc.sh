#I use Cygwin. This makes shell scripts runnable.
source ~/.bash_profile

wdir="`pwd`"
operalink="$wdir/build/operalink.js"

rm -rf ./jsdoc

echo "$operalink"
#If you want to use this script, change this to the location of JSDoc
pushd /c/Users/spadija/Programs/Programming/JSDoc
cp "$operalink" .

java -jar jsrun.jar app/run.js -a -t=templates/jsdoc operalink.js
rm operalink.js

cp -r ./out/jsdoc "$wdir/"

popd
