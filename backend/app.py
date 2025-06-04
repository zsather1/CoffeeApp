from flask import Flask, request, jsonify
from flask_cors import CORS
import PayAlg as pay

alg = pay.PayAlg()
app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

# Define a new route for '/select_person' that accepts POST requests.
#Example: curl -X POST -H "Content-Type: application/json" -d '{"orders": [["Oliver", 1],["Sophia", 1],["Liam", 3]]}' http://127.0.0.1:5000/select_person
@app.route('/select_person', methods=['POST'])
def who_pays_data():
    """
    This function handles POST requests to /process_json.
    It expects JSON data in the request body, processes it,
    and returns a JSON response.
    """
    try:
        # Get the JSON data from the request body.
        # request.get_json() parses the incoming JSON request data and returns it as a Python dictionary.
        input_json = request.get_json()

        if not input_json:
            # If no JSON data is provided or it's empty, return an error response.
            return jsonify({"error": "No JSON data provided"}), 400

        orders = input_json.get('orders', '[]')
        amount = alg.who_pays(orders)
        print(alg.people)

        # Create a response dictionary
        output_json = {
            "received_data": input_json,
            "message": f"{amount}",
            "status": "success"
        }

        # Return the processed data as a JSON response with a 200 OK status.
        return jsonify(output_json), 200

    except Exception as e:
        # Handle cases where the request body is not valid JSON or other errors occur.
        # Log the error for debugging (optional, but good practice)
        app.logger.error(f"Error processing JSON: {e}")
        return jsonify({"error": "Invalid JSON data or server error", "details": str(e)}), 400

@app.route('/people_data', methods=['GET'])
def people_data():
    print(f"Getting people: {alg.people}")
    output_json = {
        "data": f"{alg.people}",
        "message":"Hello World!",
        "status": "success"
    }

    return jsonify(output_json), 200

if __name__ == '__main__':
    app.run()
