ARR=('abouts' 'adminuploads' 'announcements' 'categories' 'forms' 'functionaries' 'hostels' 'links' 'notices' 'ordinances' 'sessions' 'users')

for collection in "${ARR[@]}"
do
    mongoimport --db "HAB_DB" --collection=${collection} --file=DB/${collection}.json --jsonArray
done