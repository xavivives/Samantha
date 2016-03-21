PURPLE = '\033[95m'
BLUE = '\033[94m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'
UNDERLINE = '\033[4m'
GRAY = '\033[30m'

import time
current_time_milis = lambda: int(round(time.time()*1000))
initial_time = 0
last_time = 0

def init ():
	global initial_time
	global last_time
	initial_time = current_time_milis()
	last_time = current_time_milis()
	print RESET

def announce (str_log):
	print  RESET + BOLD + BLUE + str_log + RESET

def error (str_log):
	print RESET + RED + str_log + RESET

def data (str_log, data):
	print RESET + RED + str_log + ': ' + PURPLE + str(data)+ GRAY

def trace (str_log):
	print RESET + str_log + RESET

def resetColoring ():
	print RESET

def deltaTime():
	global last_time
	delta = current_time_milis() - last_time
	last_time = current_time_milis()
	printTime('Delta time', last_time, current_time_milis())

def totalTime():
	printTime('Total time', initial_time, current_time_milis())

def printTime(label, start, finish):
	delta = finish - start
	if(delta < 1000):
		print RESET + label + ": " + PURPLE + str(delta) + "ms" + RESET
	else :
		print RESET + label + ": " + PURPLE + str(delta/1000) + "s" + RESET

