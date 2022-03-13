# -- DEV DOCKERFILE --
# -- DO NOT USE IN PRODUCTION! --

FROM node:14
LABEL maintainer "requarks.io"

RUN sed -i 's/deb.debian.org/mirrors.163.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.163.com/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y bash curl git python make cmake g++ nano openssh-server gnupg && \
    mkdir -p /wiki

WORKDIR /wiki

ENV dockerdev 1
ENV DEVDB postgres

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
