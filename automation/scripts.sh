#!/bin/bash -x

docker_build(){
    TAG=$1
    export DOCKER_IMAGE=$DOCKER_REPO/$APPLICATION:$TAG
    docker login $DOCKER_REPO -u=$NEXUS_USERNAME -p=$NEXUS_PASSWORD
    docker build -f automation/Dockerfile . -t ${DOCKER_IMAGE}
    docker push ${DOCKER_IMAGE}
 }

git_merge(){
    git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
    git remote update
    git fetch --all
    git checkout test
    git merge --no-edit ${BITBUCKET_BRANCH}
    git push origin test
    # git merge --no-edit --progress ${BITBUCKET_BRANCH} &> merge.log
    # cat merge.log
    # conflict_check=`grep "CONFLICT" merge.log`
    # if [[ "$conflict_check" == "" ]]; then
    #   echo "Sem conflito"
    #   cat merge.log
    #   rm merge.log
    #   git push origin test
    # else
    #   echo "Conflito encontrado"
    #   cat merge.log
    #   rm merge.log
    #   exit 1
    # fi

}

#Função para buscar a versão caso a aplicação
#Quando for utilizar no pipeline: source ./automation/scripts.sh && get_version para que a variável VERSION seja
#ao contexto do bash geral
get_version(){
    grep "version" package.json > tmp_version
    sed -i 's/\"version\"\://g' tmp_version
    sed -i 's/\"//g' tmp_version
    sed -i 's/\,//g' tmp_version
    sed -i 's/^[ \t]*//' tmp_version
    export VERSION=$(cat tmp_version)
    rm tmp_version
}

git_tag(){
    git tag -am "Automatically generated" ${VERSION}
    git push origin ${VERSION}
}

#criar arquivo parar realizar deploy no ambiente de testes
# deploy(){
# cat <<EOF > deploy.sh
#     #!/bin/bash
#     sudo su -c "
#         sed -i \"/VERSAO_`echo $APPLICATION | sed -e \"s/\(.*\)/\U\1/\"`/d\" $COMPOSE_LOCATION/.env
#         sed -i \"1s/^/VERSAO_`echo $APPLICATION | sed -e \"s/\(.*\)/\U\1/\"`=${BITBUCKET_BRANCH}.${BITBUCKET_BUILD_NUMBER}\n/\" $COMPOSE_LOCATION/.env
#         cp $COMPOSE_LOCATION/.env /tmp/.deploy
#         sed -i \"/#/d\" /tmp/.deploy
#         sed -i \"/^$/d\" /tmp/.deploy 
#         sed -i \"s/^/export /\" /tmp/.deploy
#         . /tmp/.deploy
#         docker-compose -f $COMPOSE_LOCATION/docker-compose.yml stop $APPLICATION
#         docker-compose -f $COMPOSE_LOCATION/docker-compose.yml rm -f $APPLICATION
#         docker-compose -f $COMPOSE_LOCATION/docker-compose.yml up -d $APPLICATION
#     " -s /bin/sh root
# EOF
# }

#deploy(){
#cat <<EOF > deploy.sh
#    #!/bin/bash
#    sudo su -c "
#        sed -i \"/VERSAO_`echo $APPLICATION | sed -e \"s/\(.*\)/\U\1/\"`/d\" $COMPOSE_LOCATION/.env
#        sed -i \"1s/^/VERSAO_`echo $APPLICATION | sed -e \"s/\(.*\)/\U\1/\"`=${BITBUCKET_BRANCH}.${BITBUCKET_BUILD_NUMBER}\n/\" $COMPOSE_LOCATION/.env
#        cp $COMPOSE_LOCATION/.env /tmp/.deploy
#        sed -i \"/#/d\" /tmp/.deploy
#        sed -i \"/^$/d\" /tmp/.deploy
#        sed -i \"s/^/export /\" /tmp/.deploy
#        . /tmp/.deploy
#        docker-compose -f $COMPOSE_LOCATION/docker-compose.yml stop $APPLICATION
#        docker-compose -f $COMPOSE_LOCATION/docker-compose.yml rm -f $APPLICATION
#        docker-compose -f $COMPOSE_LOCATION/docker-compose.yml up -d $APPLICATION
#    " -s /bin/sh root
#EOF
#}

deploy(){
cat <<EOF > deploy.sh
    #!/bin/bash
    sudo su -c "
        sed -i \"/VERSAO_PEP_FRONT/d\" $COMPOSE_LOCATION/.env
        sed -i \"1s/^/VERSAO_PEP_FRONT=${BITBUCKET_BRANCH}.${BITBUCKET_BUILD_NUMBER}\n/\" $COMPOSE_LOCATION/.env
        cd $COMPOSE_LOCATION
        docker-compose stop $APPLICATION
        docker-compose rm -f $APPLICATION
        docker-compose up -d $APPLICATION
        docker restart nginx
    " -s /bin/sh root
EOF
}

deploy_prod(){
cat <<EOF > deploy.sh
    #!/bin/bash
    sudo su -c "
        sed -i \"/VERSAO_PEP_FRONT/d\" $COMPOSE_LOCATION/.env
        sed -i \"1s/^/VERSAO_PEP_FRONT=${VERSION}\n/\" $COMPOSE_LOCATION/.env
        cd $COMPOSE_LOCATION
        docker-compose stop $APPLICATION
        docker-compose rm -f $APPLICATION
        docker-compose up -d $APPLICATION
        docker restart nginx
    " -s /bin/sh root
EOF
}



