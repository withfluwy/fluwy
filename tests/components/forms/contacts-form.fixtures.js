export const ValidationErrorsResponse = {
    "errors": [
        {
            "name": "ValidationError",
            "data": {
                "collection": "contacts",
                "errors": [
                    {
                        "message": "This field is required.",
                        "path": "firstName"
                    },
                    {
                        "message": "This field is required.",
                        "path": "lastName"
                    },
                    {
                        "message": "Please enter a valid email address.",
                        "path": "email"
                    }
                ]
            },
            "message": "The following fields are invalid: firstName, lastName, email"
        }
    ]
}