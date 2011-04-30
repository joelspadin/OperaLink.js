source ~/.bash_profile

name="OperaLinkJS"

rm -f ./$name.oex
zip -r ./$name.zip ./config.xml ./includes/* ./script/* ./jsdoc/* ./*.html ./*.css ./*.js
#mv ./$name.zip ./$name.oex
