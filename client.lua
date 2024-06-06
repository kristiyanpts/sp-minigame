local inMinigame = false
local result = nil

local minigamesWithBotnetReward = {
    "MemoryGame",
    "SkillCheck",
    "Thermite",
    "KeypadType",
    "ColorPicker",
    "MemoryCards",
    "MemoryCards",
    "Terminal",
    "Alphabet",
    "WordMemory"
}

function MemoryGame(keysNeeded, rounds, time)
    if keysNeeded == nil or keysNeeded < 1 then keysNeeded = 5 end
    if keysNeeded > 12 then keysNeeded = 12 end
    if rounds == nil or rounds < 1 then rounds = 1 end
    if time == nil or time < 1 then time = 10000 end
    return StartMinigame({
        Type = 'MemoryGame',
        keysNeeded = keysNeeded,
        rounds = rounds,
        time = time,
    })
end

function NumberUp(keyAmount, rounds, tries, time, shuffleTime)
    if keyAmount == nil or keyAmount < 8 then keyAmount = 8 end
    if keyAmount > 40 then keyAmount = 40 end
    if rounds == nil or rounds < 1 then rounds = 1 end
    if tries == nil or tries < 1 then tries = 1 end
    if time == nil or time < 1 then time = 10000 end
    if shuffleTime == nil or shuffleTime < 1 then shuffleTime = 5000 end
    return StartMinigame({
        Type = 'NumberUp',
        keyAmount = keyAmount,
        rounds = rounds,
        tries = tries,
        time = time,
        shuffleTime = shuffleTime,
    })
end

function SkillCheck(speed, time, keys, rounds, bars, safebars)
    if speed == nil or speed < 1 then speed = 50 end
    if time == nil or time < 1 then time = 5000 end
    if keys == nil then keys = { 'a', 's', 'd', 'w' } end
    if type(keys) == 'string' then keys = { keys } end
    if rounds == nil or rounds < 1 then rounds = 1 end
    if bars == nil or bars < 5 then bars = 20 end
    if safebars == nil or safebars < 1 then safebars = 3 end
    return StartMinigame({
        Type = 'SkillCheck',
        speed = speed,
        time = time,
        keys = keys,
        rounds = rounds,
        bars = bars,
        safebars = safebars,
    })
end

function Thermite(boxes, correctboxes, time, lifes, rounds, showTime)
    if boxes == nil or boxes < 2 then boxes = 7 end
    if correctboxes == nil or correctboxes < 1 then correctboxes = 5 end
    if time == nil or time < 1 then time = 10000 end
    if lifes == nil or lifes < 1 then lifes = 2 end
    if rounds == nil or rounds < 1 then rounds = 2 end
    if showTime == nil or showTime < 1 then showTime = 3000 end
    return StartMinigame({
        Type = 'Thermite',
        boxes = boxes,
        correctboxes = correctboxes,
        time = time,
        lifes = lifes,
        rounds = rounds,
        showTime = showTime,
    })
end

function SkillBar(time, width, rounds)
    if time == nil or (type(time) ~= 'table' and time < 1) then time = 3000 end
    if width == nil or width < 1 then width = 10 end
    if rounds == nil or rounds < 1 then rounds = 2 end
    return StartMinigame({
        Type = 'SkillBar',
        time = time,
        width = width,
        rounds = rounds,
    })
end

function ShowNumber(code, time)
    if code == nil then return false end
    if time == nil or time < 1 then time = 3000 end
    return StartMinigame({
        Type = 'KeypadShowNumber',
        code = code,
        time = time,
    })
end

function KeyPad(code, time)
    if code == nil then return false end
    if time == nil or time < 1 then time = 3000 end
    return StartMinigame({
        Type = 'KeypadType',
        code = code,
        time = time,
    })
end

function ColorPicker(icons, typeTime, viewTime)
    if icons == nil or icons < 1 then icons = 3 end
    if typeTime == nil or typeTime < 1 then typeTime = 7000 end
    if viewTime == nil or viewTime < 1 then viewTime = 3000 end
    if rounds == nil or rounds < 1 then rounds = 2 end
    return StartMinigame({
        Type = 'ColorPicker',
        icons = icons,
        typeTime = typeTime,
        viewTime = viewTime,
        rounds = rounds,
    })
end

function MemoryCards(difficulty, time, rounds)
    if difficulty == nil then difficulty = 'medium' end
    if rounds == nil or rounds < 1 then rounds = 1 end
    return StartMinigame({
        Type = 'MemoryCards',
        difficulty = difficulty,
        rounds = rounds,
    })
end

function Mines(boxes, lifes, mines, special, values)
    if boxes == nil then boxes = 5 end
    if lifes == nil or lifes < 1 then lifes = 2 end
    if mines == nil or mines < 1 then lifes = 8 end
    if special == nil or special < 1 then lifes = 1 end
    return StartMinigame({
        Type = 'Mines',
        boxes = boxes,
        lifes = lifes,
        mines = mines,
        special = special,
        values = values,
    })
end

function Path(gridSize, lives, timeLimit)
    if gridSize == nil then gridSize = 19 end
    if lives == nil or lives < 1 then lives = 3 end
    if timeLimit == nil or timeLimit < 1000 then timeLimit = 10000 end
    return StartMinigame({
        Type = 'Path',
        gridSize = gridSize,
        lives = lives,
        timeLimit = timeLimit,
    })
end

function Math(timeLimit)
    if timeLimit == nil or timeLimit < 1000 then timeLimit = 10000 end
    return StartMinigame({
        Type = 'Math',
        timeLimit = timeLimit,
    })
end

function Spot(gridSize, timeLimit, charSet, required)
    if gridSize == nil then gridSize = 19 end
    if timeLimit == nil or timeLimit < 1000 then timeLimit = 10000 end
    if charSet == nil then charSet = "alphabet" end
    if required == nil or required < 1 then required = 5 end
    return StartMinigame({
        Type = 'Spot',
        gridSize = gridSize,
        timeLimit = timeLimit,
        charSet = charSet,
        required = required
    })
end

function Lockpick(timeLimit)
    if timeLimit == nil or timeLimit < 1 then timeLimit = 1 end
    TriggerEvent("sp-minigame:client:used-lockpick")
    return StartMinigame({
        Type = 'Lockpick',
        time = timeLimit,
    })
end

function RoofRunning(rows, cols, timeLimit)
    if rows == nil or rows < 5 then rows = 5 end
    if cols == nil or cols < 5 then cols = 5 end
    if timeLimit == nil or timeLimit < 1 then timeLimit = 1 end
    return StartMinigame({
        Type = 'RoofRunning',
        rows = rows,
        cols = cols,
        time = timeLimit,
    })
end

function Alphabet(amount, time)
    if amount == nil or amount < 5 then amount = 5 end
    if time == nil or time < 5 then time = 5 end
    return StartMinigame({
        Type = 'Alphabet',
        amount = amount,
        time = time
    })
end

function Terminal(wordLength, retryCount, time)
    if wordLength == nil or wordLength < 5 then wordLength = 5 end
    if retryCount == nil or retryCount < 5 then retryCount = 5 end
    if time == nil or time < 5 then time = 5 end
    return StartMinigame({
        Type = 'Terminal',
        length = wordLength,
        retries = retryCount,
        time = time,
    })
end

function WordMemory(words, time)
    if time == nil or time < 5 then time = 5 end
    if words == nil or words < 5 then words = 5 end
    return StartMinigame({
        Type = 'WordMemory',
        timeLimit = time,
        words = words,
    })
end

function Untangle(dots, time)
    if dots == nil or dots < 5 then dots = 5 end
    if time == nil or time < 5 then time = 5 end
    return StartMinigame({
        Type = 'Untangle',
        timeLimit = time,
        dots = dots
    })
end

function StartMinigame(data)
    inMinigame = data.Type
    result = nil
    SendNUIMessage(data)
    repeat
        SetNuiFocus(true, true)
        SetPauseMenuActive(false)
        DisableControlAction(0, 1, true)
        DisableControlAction(0, 2, true)
        Wait(0)
    until inMinigame == false
    return result
end

RegisterNUICallback('Fail', function()
    SetNuiFocus(false, false)
    result = false
    inMinigame = false
end)

RegisterNUICallback('Success', function()
    SetNuiFocus(false, false)

    result = true
    inMinigame = false
end)

RegisterNUICallback('CallBack', function(data)
    SetNuiFocus(false, false)
    result = data
    inMinigame = false
end)

exports('MemoryGame', MemoryGame)
exports('NumberUp', NumberUp)
exports('SkillCheck', SkillCheck)
exports('Thermite', Thermite)
exports('SkillBar', SkillBar)
exports('ShowNumber', ShowNumber)
exports('KeyPad', KeyPad)
exports('ColorPicker', ColorPicker)
exports('MemoryCards', MemoryCards)
exports('Mines', Mines)
exports('Path', Path)
exports('Math', Math)
exports('Spot', Spot)
exports('Lockpick', Lockpick)
exports('RoofRunning', RoofRunning)
exports('Alphabet', Alphabet)
exports('Terminal', Terminal)
exports('WordMemory', WordMemory)
exports('Untangle', Untangle)
