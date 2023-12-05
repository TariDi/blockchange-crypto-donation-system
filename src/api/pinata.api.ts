import axios from 'axios';

const BASE_URL = 'https://api.example.com'

const DEFAULT_IMG = 'Qma8CWYsSucSNCz7chztuBGssoBDAdkeYsu97jWNFibVYq'

const keyRestrictions = {
    keyName: 'Signed Upload JWT',
    maxUses: 1,
    permissions: {
      endpoints: {
        data: {
          pinList: false,
          userPinnedDataTotal: false
        },
        pinning: {
          pinFileToIPFS: true,
          pinJSONToIPFS: false,
          pinJobs: false,
          unpin: false,
          userPinPolicy: false
        }
      }
    }
  }


  export async function uploadFile(fileData) {
    try {
      if(fileData) {
        fileData.append(
          'pinataOptions',
          JSON.stringify({
          cidVersion: 0,
        }))
        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS", 
          fileData,
          {
              headers: {
                  'Content-Type': `multipart/form-data`,
                  Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
                }
          }
        )
        return res.data.IpfsHash
      }
      return DEFAULT_IMG
    } catch (error) {
        window.alert(error)
    }

    // if (req.method === "POST") {
    //   try {
    //     const options = {
    //       method: 'POST',
    //       headers: {
    //         accept: 'application/json',
    //         'content-type': 'application/json',
    //         authorization: `Bearer ${process.env.PINATA_JWT}`
    //       },
    //       body: JSON.stringify(keyRestrictions)
    //     }
    //     const jwtResponse = await fetch('https://api.pinata.cloud/users/generateApiKey', options);
    //     const json = await jwtResponse.json();
    //     const { JWT } = json;
    //     res.send(JWT);
    //   } catch (e) {
    //     console.log(e);
    //     res.status(500).send("Server Error");
    //   }


  }

  export async function uploadCaseDetails(caseData) {
    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS", 
            JSON.stringify(caseData),
            {
                headers: {
                    'Content-Type': `application/json`,
                    Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
                  }
            }
        )
        //console.log(res)
        return res.data.IpfsHash
    } catch (error) {
        window.alert(error)
    }

  }

  export function getCaseImage(imageHash: string) {
    try {
      // const res = await axios.get(
      //   `${import.meta.env.VITE_PUBLIC_GATEWAY_URL}/ipfs/${imageHash}?pinataGatewayToken=${import.meta.env.VITE_PUBLIC_GATEWAY_TOKEN}&download=true`
      // )
      console.log(`${import.meta.env.VITE_PUBLIC_GATEWAY_URL}/ipfs/${imageHash}?pinataGatewayToken=${import.meta.env.VITE_PUBLIC_GATEWAY_TOKEN}`)
      return `${import.meta.env.VITE_PUBLIC_GATEWAY_URL}/ipfs/${imageHash}?pinataGatewayToken=${import.meta.env.VITE_PUBLIC_GATEWAY_TOKEN}`
    } catch (error) {
      console.error(error)
    }
  }

  export async function getCaseDetails(detailsHash: string) {
    try {
      const res = await axios.get (
        `${import.meta.env.VITE_PUBLIC_GATEWAY_URL}/ipfs/${detailsHash}?pinataGatewayToken=${import.meta.env.VITE_PUBLIC_GATEWAY_TOKEN}`
      )
      console.log(res)
      return res.data
    } catch (error) {
      console.error(error)
    }
  }

// } else if (req.method === "GET") {
//     try {
//       const response = await pinata.pinList(
//         { pinataJWTKey: process.env.PINATA_JWT },
//         {
//           pageLimit: 1,
//         }
//       );
//       res.json(response.rows[0]);
//     } catch (e) {
//       console.log(e);
//       res.status(500).send("Server Error");
//     }
//   }