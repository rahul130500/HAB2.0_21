ARR=('abouts' 'adminuploads' 'announcements' 'categories' 'forms' 'functionaries' 'hostels' 'links' 'notices' 'ordinances' 'sessions' 'users')

for collection in "${ARR[@]}"
do
	mongoexport --uri="mongodb://localhost/HAB_DB" --collection=${collection} --out=DB/${collection}.json --jsonArray
done