const SavedWords = (props) => {
    const savedWordsArray = props.saved;

    const savedOutput = () => {
        if (savedWordsArray.length === 0) {
            return '(none)';
        } else {
            return savedWordsArray.join(', ');
        }
    }

    return (
        <div className="row">
            <div className="col">Saved words: <span id="saved_words">{savedOutput()}</span></div>
        </div>
    )
}

export default SavedWords;