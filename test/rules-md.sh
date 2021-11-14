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
    echo "" >> ${MD}
    echo "## Rule-${index}" >> ${MD} 
    echo "" >> ${MD}
    echo "**Rule Name:** \`${rule_name}\` &nbsp;&nbsp;&nbsp;&nbsp;" >> ${MD} 
    echo "**Rule File:** [${rule}](${rule})" >> ${MD}
    echo "" >> ${MD}
    echo "### Conditions" >> ${MD}  
    echo "" >> ${MD}
    echo "|Fact(s)|Operator|Value|" >> ${MD}
    echo "|---|---|---|" >> ${MD}
    yq -r '.conditions.all[] | map(.) | @csv'  ${rule} | sed 's/^"/|/g' | sed 's/","/\|/g' | sed 's/"/|/g' >>  ${MD}
    echo "" >> ${MD}

    event_type=$(yq -r '.event.type' ${rule})
    data=""
    for i in $(yq -r '.event.params.data | map(.) | @csv' ${rule} | sed 's/ /_/g')
    do 
        i=$(echo $i | sed 's/\"/ /g')
        data="$(echo $i | sed 's/_/ /g') ${data}"
    done
    echo "### Event" >> ${MD}  
    echo "" >> ${MD}
    echo "|Type|Data|" >> ${MD}
    echo "|---|---|" >> ${MD}
    echo "|${event_type}|${data}|" >>  ${MD}
    echo "---" >> ${MD}  
done
