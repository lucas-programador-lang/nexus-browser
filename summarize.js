async function resumirPagina(){

const texto = document.body.innerText

const resposta = await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer SUA_API_KEY"
},

body: JSON.stringify({

model:"gpt-4.1-mini",

messages:[
{role:"system",content:"Resuma o texto"},
{role:"user",content:texto.slice(0,5000)}
]

})

})

const data = await resposta.json()

alert(data.choices[0].message.content)

}
