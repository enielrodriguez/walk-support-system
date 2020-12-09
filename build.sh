echo "1/3 Building frontend..."
cd client
npm run build
rm build/index.html

echo "2/3 Creating api folder..."
cd ../server
composer install
mkdir files2
mv files/.htaccess files2
rm -rf files/
mv files2 files
cd ..

mkdir api
cp server/index.php api
cp server/.htaccess api
cp server/composer.json api
cp server/composer.lock api
cp -r server/controllers api
cp -r server/data api
cp -r server/libs api
cp -r server/models api
cp -r server/vendor api
cp -r server/files api
cp server/config.php api
echo -n > api/config.php
chmod -R 755 .

cp client/src/index.php client/build

echo "3/3 Generating zip..."
cd client/build
zip -r opensupports_prod.zip . -x .htaccess images
zip -u opensupports_prod.zip .htaccess
zip -ur opensupports_prod.zip images
mv opensupports_prod.zip ../..

cd ../..
zip -ur opensupports_prod.zip api

mkdir -p dist
mv opensupports_prod.zip dist
rm -r api
