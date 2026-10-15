# Lets pytest import modules (analytics.py ...) from the ai-service folder.
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
