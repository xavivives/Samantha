import tensorflow as tf

# The ouput array. of Any x 784
x = tf.placeholder(tf.float32, [None ,784])

# W are the weights 
W = tf.Variable(tf.zeros([784,10]))

# b are the bias
b = tf.Variable(tf.zeros([10]))

# The model. tf.matmul its a matrix multiplication
y = tf.nn.softmax(tf.matmul(x, W) + b)

print "Sam executed"