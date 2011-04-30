#I use Cygwin. This makes shell scripts runnable.
source ~/.bash_profile

name="TestExtension"

pushd src
rm -f ../build/$name.oex
zip -r ../build/$name.zip ./config.xml ./includes/* ./script/* ./*.html ./*.css ./*.js
popd
mv build/$name.zip build/$name.oex

cp src/script/operalink.js build/
cp src/script/oauth.js build/
cp src/script/sha1.js build/
