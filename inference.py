!pip install --quiet unsloth
!pip install --quiet --force-reinstall --no-cache-dir --no-deps git+https://github.com/unslothai/unsloth.git

from google.colab import drive
from unsloth import FastLanguageModel

# Mount Google Drive
drive.mount('/content/drive')

# Define the path where the model is stored in Google Drive
MODEL_PATH = "/content/drive/MyDrive/DeepSeek-7B-Medical/"

# Load the fine-tuned model from Drive
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_PATH,  # Load from Google Drive
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=True,
)

# Define the prompt structure
prompt_style = """Below is an instruction that describes a task, paired with an input that provides further context.
Write a response that appropriately completes the request.
Before answering, think carefully about the question and create a step-by-step chain of thoughts to ensure a logical and accurate response.

### Instruction:
You are a medical expert with advanced knowledge in clinical reasoning, diagnostics, and treatment planning.
Please answer the following medical question.

### Question:
{}

### Response:
<think>{}"""

# Optimize model for inference
FastLanguageModel.for_inference(model)

# Get user input
question = input("Enter your symptoms: ")

# Tokenize input and move to GPU
inputs = tokenizer([prompt_style.format(question, "")], return_tensors="pt").to("cuda")

# Generate response
outputs = model.generate(
    input_ids=inputs.input_ids,
    attention_mask=inputs.attention_mask,
    max_new_tokens=1200,
    use_cache=True,
)

# Decode and print response
response = tokenizer.batch_decode(outputs)
formatted_resp = response[0].split("</think>")[-1]
print(formatted_resp.replace(tokenizer.eos_token, ""))
