+-----------------------------+         HTTP POST (image + prompt)         +-----------------------------+
|        Frontend (React)     |  --------------------------------------->  |        Backend (FastAPI)     |
|-----------------------------|                                            |-----------------------------|
|  - Webcam UI                |                                            |  - Receives image & prompt  |
|  - User selects prompt      |                                            |  - Loads FastVLM-0.5B model |
|  - Sends image+prompt       |                                            |  - Preprocesses image       |
|    to backend /caption      |                                            |  - Builds prompt            |
|  - Shows live captions      |  <---------------------------------------  |  - Runs model inference     |
|                             |         HTTP Response (caption)            |  - Returns caption          |
+-----------------------------+                                            +-----------------------------+
                                                                              |
                                                                              | (uses model weights)
                                                                              v
                                                                  +-----------------------------+
                                                                  |   FastVLM-0.5B Model (HF)   |
                                                                  |-----------------------------|
                                                                  |  - Vision-Language Model    |
                                                                  |  - Accepts image + prompt   |
                                                                  |  - Generates caption text   |
                                                                  +-----------------------------+