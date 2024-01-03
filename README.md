## Elastic Generator Backend

### Overview

"ElasticGenerator" serves as a comprehensive tool designed to facilitate idea generation and seamlessly translate
concepts into digital formats. The platform employs integrated OpenAI text chat functionality to assist users in
generating substantive ideas. Once a suitable text is generated, the tool utilizes text-to-speech functionality to
convert it into audio. The next step involves creating a visual representation of the idea by generating images through
the DALL·E model from OpenAI. Finally, users can bring their concepts to life by combining the generated audio and
visual elements to produce a video, leveraging the Runway API.

### Technologies and tools

- TypeScript/JavaScript - main programming language
- Node.js - application runtime
- Nest.js - framework for building scalable apis
- PostgreSQL - main database
- OpenAI API - used for text, text-to-speech and image generation
- Runway API - user for generating videos (not implemented yet)
- Docker Compose - to start database instances
