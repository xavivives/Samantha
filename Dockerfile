# Starting from a tensorflow image
FROM b.gcr.io/tensorflow/tensorflow

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/*

# Copying the script from host current directory to container
ADD First.py First.py

# Run the python script
CMD python -u First.py
