FROM    docker pull ipfs/go-ipfs

RUN     yum install -y epel-release
# Install Node.js and npm
RUN yum install -y nodejs npm

# Install app dependencies
#COPY package.json /src/package.json
#RUN cd /src; npm install --production

# Install app dependencies
COPY package.json package.json
RUN npm install --production

# Bundle app source
COPY /src /src

# Install Mongo DB
RUN yum install -y mongodb-org

EXPOSE  8080
CMD ["node", "/src/index.js"]