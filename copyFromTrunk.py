# -*- coding: utf-8 -*-
import os
import subprocess
import sys
import re
import json
import random
import shutil
import filecmp
import difflib
import multiprocessing
import shelve
from hashlib import md5
import argparse
try:
	import xml.etree.cElementTree as ET
except ImportError:
	import xml.etree.ElementTree as ET


class CONFIG(object):
	TRUNK_PATH = unicode('../../../cocos/cocosProject/', "utf-8")


def jsonWalker(fname, j, func, ud):
	if isinstance(j, dict):
		func(fname, j, ud)
		for k, v in j.iteritems():
			jsonWalker(fname, v, func, ud)
	elif isinstance(j, list):
		for v in j:
			jsonWalker(fname, v, func, ud)


def cmdCopy(srcPath, dstPath, excludeSuffix=None):
	while srcPath[-1] == '/':
		srcPath = srcPath[:-1]
	cmd = u' {src} {dst}'.format(src=srcPath, dst=(dstPath))
	cmd = cmd.replace('/', '\\')
	if os.path.isdir(srcPath):
		cmd = 'echo d |' + u'xcopy ' + cmd + ' /Y /S'
	else:
		cmd = 'echo f |' + u'xcopy ' + cmd + ' /Y'

	if excludeSuffix:
		subprocess.call((u'echo %s > excludefilelist.txt' % excludeSuffix).encode(sys.getfilesystemencoding()), shell=True)
		cmd += ' /EXCLUDE:excludefilelist.txt'
	subprocess.call(cmd.encode(sys.getfilesystemencoding()), shell=True)


def updateTrunk():
	cmd = 'svn up %s' % CONFIG.TRUNK_PATH
	subprocess.call(cmd.encode(sys.getfilesystemencoding()), shell=True)

	cmd = 'svn up'
	subprocess.call(cmd.encode(sys.getfilesystemencoding()), shell=True)


def recoredRes(fname, jo, resSet):
	if jo.get('path') is not None:
		resSet.add(jo['path'])


def copyToStable(resSet):
	for res in resSet:
		cmdCopy(CONFIG.TRUNK_PATH + 'Resources/' + res, './Resources/' + res)


def copyResourceInJson(jsonPath):
	file = open(jsonPath)
	cont = file.readlines()
	jsonCont = ''.join(cont)
	jsonObj = json.loads(jsonCont)
	resSet = set([])
	jsonWalker(jsonPath, jsonObj, recoredRes, resSet)
	copyToStable(resSet)
	# print resSet


def main(srcJson):
	#updateTrunk()
	cmdCopy(CONFIG.TRUNK_PATH + 'Json/' + srcJson, './Json/' + srcJson)
	copyResourceInJson('./Json/' + srcJson)
	print 'copy'

if __name__ == '__main__':

	parser = argparse.ArgumentParser(description='Process some integers.')
	parser.add_argument('srcPath', type=str, help='from json path')

	args = parser.parse_args()
	print(args.srcPath)
	srcPath = args.srcPath
	if not srcPath.endswith('.json'):
		srcPath += '.json'
	main(srcPath)
