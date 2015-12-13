#!/bin/bash

id_obj=$( curl -X POST   -H "X-Parse-Application-Id: EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX"   -H "X-Parse-REST-API-Key: dHGThFDzjfCqz8TJcju2dfOOybkHj3Wr402PJG0y" -H "Content-Type: application/json"  -d '{}'  https://api.parse.com/1/functions/RetrieveUserId )
echo $id_obj
id_array=$(echo $id_obj | jq '.result')
echo $id_array

id_one=$(echo $id_array | jq '.[0:1]')
echo $id_one

id_one_part2=${id_one:4:12}
echo $id_one_part2

id_obj2=$(echo '{"user_id":'$id_one_part2'}')
echo $id_obj2

curl -X POST -H "X-Parse-Application-Id: EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX"   -H "X-Parse-REST-API-Key: dHGThFDzjfCqz8TJcju2dfOOybkHj3Wr402PJG0y" -H "Content-Type: application/json" -d $id_obj2 https://api.parse.com/1/functions/update_user_data

echo "--------------"
#curl -X POST -H "X-Parse-Application-Id: EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX"   -H "X-Parse-REST-API-Key: dHGThFDzjfCqz8TJcju2dfOOybkHj3Wr402PJG0y" -H "Content-Type: application/json" -d '{"user_id":"GMNDBekeAm"}' https://api.parse.com/1/functions/update_user_data
for item in $id_array; do
	echo $item
	item_one_part2=${item:0:12}
	id_obj3=$(echo '{"user_id":'$item_one_part2'}')
	echo $id_obj3
	curl -X POST -H "X-Parse-Application-Id: EWPPdrDVaAIqhRazWp8K0ZlmafAAPt93JiOAonvX"   -H "X-Parse-REST-API-Key: dHGThFDzjfCqz8TJcju2dfOOybkHj3Wr402PJG0y" -H "Content-Type: application/json" -d $id_obj3 https://api.parse.com/1/functions/update_user_data

done


