#!/bin/bash 

ROOT='src/';
CORE=node_modules/@travetto
MOD=src/model

rm -rf build/
FILES=`find $ROOT/model -name '*.ts' | grep -v '.*.d.ts'`
DECLS="-d $CORE/model/$MOD/*.ts"

for f in $FILES; do
  DECLS="$DECLS -d $f"
done

COMPILE="tsc  
  --lib es2015,es2016,dom
  -t es2015
  -m es2015 
  --outDir build/  
  --experimentalDecorators  
  --preserveConstEnums 
  $DECLS"

$COMPILE | grep -v 'Cannot find module'

DECLS=`find build/ -name '*.d.ts' | grep 'model' | grep -v '@travetto/model/src/lib/model/types' | grep -v 'util' `

cat $DECLS |\
  grep -v import |\
  grep -v \(\) |\
  grep -v static |\
  grep -v 'reference types' |\
  tr '\t' ' ' |\
  sed \
    -e 's/export \*.*$//' \
    -e 's/ default / /' \
    -e 's/export /declare /' \
    -e 's/\(const \(.*\)\):/interface \2 /' \
    -e 's/const  /interface /' \
    -e 's/class /interface /' \
    -e 's/abstract //' \
    -e 's/declare declare/declare/' \
    -e 's/declare/export/' \
    -e 's/implements /extends /' \
    -e 's/ \([A-Za-z_]\{1,100\}\): \([A-Za-z]\)/ \1?: \2/g' |\
  tr '\n' '\t' |\
  perl -pe 's/export [_A-Z][^;]+;//g' |\
  perl -pe 's/constructor[^)]*\);//g' |\
  tr '\t' '\n' > model.ts 

rm -rf build/
