print "\n\nStarting Sam..."

import Log
Log.init()


import time
current_milli_time = lambda: int(round(time.time() * 1000))
initial_time = current_milli_time()

print "Total time: "+ str(current_milli_time() - initial_time) 

Log.announce("Importing Libraries...")

#importing training datasets
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

#importing tensorflow library
import tensorflow as tf


Log.announce("Initializing variables")
#output
x = tf.placeholder(tf.float32, [None, 784])

#weight
W = tf.Variable(tf.zeros([784, 10]))
#bias
b = tf.Variable(tf.zeros([10]))


Log.announce("Creating model...")
#model. Just defining it
y = tf.nn.softmax(tf.matmul(x, W) + b)

Log.announce("Initializing training...")

#placeholder for cross-entropy
y_ = tf.placeholder(tf.float32, [None, 10])

#cross-entropy. Is it executing it already or is just the model of it
cross_entropy = -tf.reduce_sum(y_ * tf.log(y))

#Optimization algorithm used in each step of the training
train_step = tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)

#initialize all variables created. W and b? x 	and y_? everything?
init = tf.initialize_all_variables()


Log.announce("Starting training...")

sess = tf.Session()
sess.run(init)

for i in range(100):
	Log.deltaTime()
	Log.data("Training batch ", i)
	batch_xs, batch_ys = mnist.train.next_batch(100)
	sess.run(train_step, feed_dict = {x: batch_xs, y_:batch_ys})

Log.announce("Training finished")

Log.announce("Total time: "+ str(current_milli_time() - initial_time))
Log.totalTime()
Log.resetColoring()
