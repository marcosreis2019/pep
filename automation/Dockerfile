FROM nginx
MAINTAINER Luiz Comelli

ADD ./dist/app /usr/share/nginx/html/app

RUN rm -f /etc/nginx/conf.d/default.conf
ADD ./automation/default.conf /etc/nginx/conf.d/
#ADD ./app.conf /etc/nginx/conf.d/

RUN chmod 777 -R /usr/share/nginx/

EXPOSE 80
