echo "1/4 Building frontend..."
cd client
npm run build
rm build/index.html

echo "2/4 Creating api folder..."
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

echo "3/4 Cleaning prod folder..."
rm -rf /var/www/html/supportsys/
mkdir /var/www/html/supportsys


echo "4/4 Copping files..."
cp -r client/build/* /var/www/html/supportsys
cp -r api/ /var/www/html/supportsys/api
cp LICENSE /var/www/html/supportsys
cp installation-key.txt /var/www/html/supportsys

rm -rf api/
rm -rf client/build/
