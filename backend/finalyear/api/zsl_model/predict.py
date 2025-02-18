from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the model and tokenizer

MODEL_PATH = "./DeepSeek-1.5B-Medical"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    torch_dtype=torch.float16,
    device_map="auto"
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

def predict_disease(symptom: str) -> str:
    """Generate a medical response based on the given symptom description."""
    if not symptom:
        return "Error: No symptoms provided."

    # Tokenize input
    inputs = tokenizer([prompt_style.format(symptom, "")], return_tensors="pt").to("cuda")

    # Generate response
    outputs = model.generate(
        input_ids=inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_new_tokens=1200
    )

    # Decode and format response
    response = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    formatted_resp = response[0].split("</think>")[-1]
    return formatted_resp.strip()