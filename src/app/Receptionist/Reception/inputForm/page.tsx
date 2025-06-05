export default function InputForm() {
    return (
        <>
            <div className="input-form">
                <h1>Input Form</h1>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                    
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}