import { useState } from "react";
import SavedWords from "./SavedWords";

const RhymeListing = () => {
    const [wordInput, setWordInput] = useState('');
    const [wordOutput, setWordOutput] = useState('');
    const [savedWordsArray, setSavedWordsArray] = useState([]);

    function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if(typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }
    
        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for(const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if(!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }
    
        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for(const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }

    function datamuseRequest(url, callback) {
        setWordOutput(<h2>...loading</h2>);
        console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // This invokes the callback that updates the page.
                callback(data);
            }, (err) => {
                console.error(err);
            });
    }
    
    function getDatamuseRhymeUrl(rel_rhy) {
        return `https://api.datamuse.com/words?${(new URLSearchParams({'rel_rhy': rel_rhy})).toString()}`;
    }
    
    function getDatamuseSimilarToUrl(ml) {
        return `https://api.datamuse.com/words?${(new URLSearchParams({'ml': ml})).toString()}`;
    }
    
    const inputChange = (e) => {
        setWordInput(e.target.value);
    }

    function generateListWords(item) {
        const listWords = Object.entries(item).map(([index, words]) => {
            return <li key={index}>{words.word}<button key={index} type="button" className="btn btn-outline-success" onClick={() => addToSavedWords(words.word)} >(save)</button></li>
        });
        // console.log(listWords)
        return listWords
    }

    function rhymeCallback(data) {
        const wordsToShow = [];

        if (data.length !== 0) {
            wordsToShow.push(<h2>Words that rhyme with {wordInput}</h2>);
            let groupData = groupBy(data, 'numSyllables');
            console.log(groupData);
            Object.entries(groupData).map(([numSyllables, item]) => {
                wordsToShow.push(
                    <div key={numSyllables}>
                        <h3 key={'h3'+numSyllables}>Syllables: {numSyllables}</h3>
                        <ul key={'ul'+numSyllables}>
                            {generateListWords(item)}
                        </ul>
                    </div>
                )
            })
        } else {
            wordsToShow.push(<h2>(no results)</h2>);
        }
        setWordOutput(wordsToShow);
    }

    function similarToCallback(data) {
        const wordsToShow = [];

        if (data.length !== 0) {
            wordsToShow.push(<h2>Words with a similar meaning to {wordInput}</h2>);
            wordsToShow.push(
                <ul>
                    {generateListWords(data)}
                </ul>
            )
        } else {
            wordsToShow.push(<h2>(no results)</h2>);
        }
        setWordOutput(wordsToShow);
    }
    
    function addToSavedWords(word) {
        // You'll need to finish this...
        setSavedWordsArray((previousArray) => {
            return [...previousArray, word]
        });
    }

    const keyDownHandler = (e) => {
        if (e.keyCode === 13) {
            datamuseRequest(getDatamuseRhymeUrl(wordInput), rhymeCallback);
        }
    }

    return (
        <>
            <SavedWords saved={savedWordsArray}/>
            <div className="row">
                <div className="input-group col">
                    <input className="form-control" type="text" placeholder="Enter a word" id="word_input" onKeyDown={keyDownHandler} onChange={inputChange}/>
                    <button id="show_rhymes" type="button" className="btn btn-primary" onClick={() => datamuseRequest(getDatamuseRhymeUrl(wordInput), rhymeCallback)}>Show rhyming words</button>
                    <button id="show_synonyms" type="button" className="btn btn-secondary" onClick={() => datamuseRequest(getDatamuseSimilarToUrl(wordInput), similarToCallback)}>Show synonyms</button>
                </div>
            </div>
            <div className="row">
                <h2 className="col" id="output_description"></h2>
            </div>
            <div className="output row">
                <output id="word_output" className="col">{wordOutput}</output>
            </div>
        </>
    )
}

export default RhymeListing;