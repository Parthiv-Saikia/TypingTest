const wordString = `
ability able about above accept according account across act action activity
actually add address administration admit adult affect after again against age
agency agent ago agree agreement ahead air all allow almost alone along already
also although always American among amount analysis and animal another answer
any anyone anything appear apply approach area argue arm around arrive art
article artist as ask assume at attack attention attorney audience author
authority available avoid away baby back bad bag ball bank bar base be beat
beautiful because become bed before begin behavior behind believe benefit best
better between beyond big bill billion bit black blood blue board body book
born both box boy break bring brother budget build building business but buy
by call camera campaign can cancer candidate capital car card care career
carry case catch cause cell center central century certain certainly chair
challenge chance change character charge check child choice choose church
citizen city civil claim class clear clearly close coach cold collection
college color come commercial common community company compare computer concern
condition conference Congress consider consumer contain continue control cost
could country couple course court cover create crime cultural culture cup
current customer cut dark data daughter day dead deal death debate decade
decide decision deep defense degree Democrat democratic describe design despite
detail determine develop development die difference different difficult dinner
direction director discover discuss discussion disease do doctor dog door down
draw dream drive drop drug during each early east easy eat economic economy
edge education effect effort eight either election else employee end energy
enjoy enough enter entire environment environmental especially establish even
evening event ever every everybody everyone everything evidence exactly example
executive exist expect experience expert explain eye face fact factor fail fall
family far fast father fear federal feel feeling few field fight figure fill
film final finally financial find fine finger finish fire firm first fish five
floor fly focus follow food foot for force foreign forget form former forward
four free friend from front full fund future game garden gas general generation
get girl give glass go goal good government great green ground group grow
growth guess gun guy hair half hand hang happen happy hard have he head health
hear heart heat heavy help her here herself high him himself his history hit
hold home hope hospital hot hotel hour house how however huge human hundred
husband I idea identify if image imagine impact important improve in include
including increase indeed indicate individual industry information inside
instead institution interest interesting international interview into
investment involve issue it item its itself job join just keep key kid kill
kind kitchen know knowledge land language large last late later laugh law
lawyer lay lead leader learn least leave left leg legal less let letter level
lie life light like likely line list listen little live local long look lose
loss lot love low machine magazine main maintain major majority make man manage
management manager many market marriage material matter may maybe me mean
measure media medical meet meeting member memory mention message method middle
might military million mind minute miss mission model modern moment money month
more morning most mother mouth move movement movie Mr Mrs much music must my
myself name nation national natural nature near nearly necessary need network
never new news newspaper next nice night no none nor north not note nothing
notice now number occur of off offer office officer official often oh oil ok
old on once one only onto open operation opportunity option or order
organization other others our out outside over own owner page pain painting
paper parent part participant particular particularly partner party pass past
patient pattern pay peace people per perform performance perhaps period person
personal phone physical pick picture piece place plan plant play player PM
point police policy political politics poor popular population position
positive possible power practice prepare present president pressure pretty
prevent price private probably problem process produce product production
professional professor program project property protect prove provide public
pull purpose push put quality question quickly quite race radio raise range
rate rather reach read ready real reality realize really reason receive recent
recently recognize record red reduce reflect region relate relationship
religious remain remember remove report represent Republican require research
resource respond response responsibility rest result return reveal rich right
rise risk road rock role room rule run safe same save say scene school science
scientist score sea season seat second section security see seek seem sell
send senior sense series serious serve service set seven several sex sexual
shake share she shoot short shot should shoulder show side sign significant
similar simple simply since sing single sister sit site situation six size
skill skin small smile so social society soldier some somebody someone
something sometimes son song soon sort sound source south southern space speak
special specific speech spend sport spring staff stage stand standard star
start state statement station stay step still stock stop store story strategy
street strong structure student study stuff style subject success successful
such suddenly suffer suggest summer support sure surface system table take talk
task tax teach teacher team technology television tell ten tend term test than
thank that the their them themselves then theory there these they thing think
third this those though thought thousand threat three through throughout throw
thus time to today together tonight too top total tough toward town trade
traditional training travel treat treatment tree trial trip trouble true truth
try turn TV two type under understand unit until up upon us use usually value
various very victim view violence visit voice vote wait walk wall want war
watch water way we weapon wear week weight well west western what whatever
when where whether which while white who whole whom whose why wide wife will
win wind window wish with within without woman wonder word work worker world
worry would write writer wrong yard yeah year yes yet you young your yourself
`;


let wordsArray = wordString.trim().split(/\s+/);


for (let i = wordsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordsArray[i], wordsArray[j]] = [wordsArray[j], wordsArray[i]];
}

const startIndex = Math.floor(Math.random() * 960);
const endIndex = startIndex + 40;
const gameText = wordsArray.slice(startIndex, endIndex).join(' ');
const characters = gameText.split('');
let currentIndex = 0;
let marginShift = 0;

function newGame() {
    const container = document.getElementById('words');
    container.innerHTML = '';
    let wordSpans = [];

    const gameWords = wordsArray
        .slice(startIndex, startIndex + 40)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    const characters = gameWords.split('');
    let word = [];

    characters.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');

        if (char === ' ') {
            // Add previous word to container
            const wordContainer = document.createElement('span');
            wordContainer.classList.add('word');
            word.forEach(s => wordContainer.appendChild(s));
            container.appendChild(wordContainer);
            wordSpans.push(wordContainer);

            // Add space separately
            container.appendChild(span);
            word = [];
        } else {
            word.push(span);
        }
    });

    // Append the last word
    if (word.length > 0) {
        const wordContainer = document.createElement('span');
        wordContainer.classList.add('word');
        word.forEach(s => wordContainer.appendChild(s));
        container.appendChild(wordContainer);
        wordSpans.push(wordContainer);
    }

    // Set characters array and reset index globally
    window.characters = container.querySelectorAll('span.letter');
    currentIndex = 0;
    updateCursorPosition();
    updateWordHighlight();
}


function updateWordHighlight() {
    const allWords = document.querySelectorAll('#words .word');
    allWords.forEach(w => {
        w.classList.remove('current');
        w.classList.remove('next');
    });

    const spans = document.querySelectorAll('#words span.letter');

    if (currentIndex < spans.length) {
        let currentSpan = spans[currentIndex];
        let currentWord = currentSpan.closest('.word');

        if (currentWord) {
            currentWord.classList.add('current');
            let nextWord = currentWord.nextElementSibling;
            if (nextWord && nextWord.classList.contains('word')) {
                nextWord.classList.add('next');
            }
        }
    }
}

function updateCursorPosition() {
    const spans = window.characters;
    const cursor = document.getElementById('cursor');
    const game = document.getElementById('game');
    const wordsContainer = document.getElementById('words');

    if (currentIndex < spans.length) {
        const charSpan = spans[currentIndex];
        const charRect = charSpan.getBoundingClientRect();
        const containerRect = game.getBoundingClientRect();

        cursor.style.left = `${charRect.left - containerRect.left}px`;
        cursor.style.top = `${charRect.top - containerRect.top}px`;
        cursor.style.display = 'block';

        // 🟡 New logic: Check if the cursor's Y is outside the visible area
        const bottomVisible = containerRect.bottom;
        const topVisible = containerRect.top;

        const buffer = 10; // Small buffer in px
        if (charRect.top > bottomVisible - buffer) {
            marginShift -= 35; // You can make this dynamic if needed
            wordsContainer.style.marginTop = `${marginShift}px`;
        }
    } else {
        cursor.style.display = 'none';
    }
}





document.getElementById('game').addEventListener('keydown', (ev) => {
    const spans = window.characters;
    console.log(ev.key);
    if (ev.key === 'Backspace') {
        if (currentIndex === 0) return;

        const prevIndex = currentIndex - 1;
        const prevChar = spans[prevIndex];
        const word = prevChar.closest('.word');

        if (word) {
            const ghosts = Array.from(word.querySelectorAll('.ghost-error'));
            if (ghosts.length > 0) {
                // Remove the last ghost error
                ghosts[ghosts.length - 1].remove();
                return;
            }
        }

        // Remove the previous character's correctness
        prevChar.classList.remove('correct', 'incorrect');
        currentIndex--;
        updateCursorPosition();
        updateWordHighlight();
        return;
    }

    if (currentIndex >= spans.length) return;

    const currentChar = spans[currentIndex].textContent;
    const typedChar = ev.key;

    if (typedChar.length !== 1) return; // Ignore non-character keys

    if (currentChar === ' ') {
        if (typedChar === ' ') {
            spans[currentIndex].classList.add('correct');

            const prevSpan = spans[currentIndex - 1];
            const word = prevSpan?.closest('.word');

            if (word) {
                const ghosts = Array.from(word.querySelectorAll('.ghost-error'));

                if (ghosts.length > 0) {
                    ghosts.forEach(el => el.style.opacity = 0);
                    setTimeout(() => {
                        ghosts.forEach(el => el.remove());
                        currentIndex++;
                        updateCursorPosition();
                        updateWordHighlight();
                    }, 100);
                } else {
                    currentIndex++;
                    updateCursorPosition();
                    updateWordHighlight();
                }
            } else {
                currentIndex++;
                updateCursorPosition();
                updateWordHighlight();
            }
        } else {
            const prevSpan = spans[currentIndex - 1];
            const word = prevSpan?.closest('.word');
            if (word) {
                const ghost = document.createElement('span');
                ghost.textContent = typedChar;
                ghost.classList.add('ghost-error');
                word.appendChild(ghost);
            }
        }
        return;
    }

    if (typedChar === currentChar) {
        spans[currentIndex].classList.add('correct');
    } else {
        spans[currentIndex].classList.add('incorrect');
    }
    

    currentIndex++;
    updateCursorPosition();
    updateWordHighlight();
});







// window.characters.forEach((c, i) => console.log(`[${i}]: "${c.textContent}"`));


// Autofocus so blur is removed and cursor appears
document.getElementById('game').focus();
window.characters = document.querySelectorAll('span.letter');

newGame();