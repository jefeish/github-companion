#!/bin/bash
# -----------------------------------------------------------------------------
# Script to display the Rules Yamls files in a more readable form (Markdown)
# Usage:
#   $ rules-md.sh <output markdown file> <path to rules yaml files>
#
# NOTE: This is the "late night", "poor judegment" version ¯\_(ツ)_/¯
# -----------------------------------------------------------------------------

MD=$1
RULES_PATH=$2

echo "# Rules" > ${MD}
echo "" >> ${MD}
index=0

for rule in $(ls -d ${RULES_PATH}/*)
do 
    index=$((index+1)) 
    rule_name=$(yq -r '.name' ${rule})
    echo "${index}. [${rule_name}](#Rule-${index})" >> ${MD} 
done
echo "---" >> ${MD}  
index=0
for rule in $(ls -d ${RULES_PATH}/*)
do 
    index=$((index+1))
    rule_name=$(yq -r '.name' ${rule})
    event_type=$(yq -r '.event.type' ${rule})
    echo "" >> ${MD}
    echo "## Rule-${index}" >> ${MD} 
    echo "" >> ${MD}
    echo "**Rule Name:** \`${rule_name}\` &nbsp;&nbsp;&nbsp;&nbsp;" >> ${MD} 
    echo "**Rule File:** [${rule}](${rule})" >> ${MD}
    echo "" >> ${MD}
    conditions=$(yq -r '.conditions.all[] | map(.) | @csv'  ${rule} | sed 's/ /_/g' | sed 's/payload\./ /g' | sed 's/"//g' )

    for condition in $(echo $conditions | sed 's/\\[tn]//g')
    do
        fact=$(echo $condition | awk '{split($0,a,","); print a[1]}' | sed 's/"//g')
        operator=$(echo $condition | awk '{split($0,a,","); print a[2]}' | sed 's/"//g')
        value=$(echo $condition | awk '{split($0,a,","); print a[3]}' | sed 's/"//g')
        
        case ${operator} in

        "contains")
            s1=""
            s2=""
            ;;
        "doesNotContain")
            s1=""
            s2=""
            ;;
        "notEqual")
            s1="is"
            s2="to"
            ;;
        "equal")
            s1="is"
            s2="to"
            ;;
        "notEmpty")
            s1="is"
            s2=""
            ;;
        "regex")
            s1="is a"
            s2="with"
            ;;
        *)
            s1=""
            s2=""
            ;;
        esac

        echo "- If the fact \`'$fact'\` $s1 \`$operator\` $s2 \`'$value'\`," >> ${MD} 
    done
    echo "" >> ${MD}
    echo "#### ... then do ['${event_type}'](src/eventHandlers/${event_type}.js)" >> ${MD}
    echo "" >> ${MD}
    echo "---" >> ${MD}  
done
