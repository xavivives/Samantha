FROM b.gcr.io/tensorflow/tensorflow

# Install Python
RUN apt-get install -y python2.7 python2.7-dev

# Copying files from host to container
ADD First.py First.py
ADD Log.py Log.py

CMD python First.py