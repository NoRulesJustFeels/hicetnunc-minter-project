# Metadata Formats

This project extends the JSON metadata information that the Hic Et Nunc minter provides based on the [TZIP-21](https://tzip.tezosagora.org/proposal/tzip-21/) spec.

The following are example metadata for different kinds of file types.

## Hic Et Nunc Minter Project
### Image
```json
{
    "name": "title",
    "description": "description",
    "rights": "rights",
    "minter": "KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9",
    "date": "2021-10-07T13:28:33.538Z",
    "tags": [
        "art",
        "3d"
    ],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://bafybeih52hdkj3fvf24ipfdnydnqipkgrp42qdtiupbbeab2gugckdakwq",
    "displayUri": "ipfs://bafybeih5mbslnso2vqqwg5te6lmera4dofhl3s2obip2v7gwusfhsxwypi",
    "thumbnailUri": "ipfs://bafkreif47ex4slgngljy23w4ewjbtjdye4spolwalwymcfqzfwiof4heni",
    "creators": [
        "tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"
    ],
    "formats": [
        {
            "uri": "ipfs://bafybeih52hdkj3fvf24ipfdnydnqipkgrp42qdtiupbbeab2gugckdakwq",
            "mimeType": "image/jpeg",
            "fileSize": 308550,
            "fileName": "burn7.jpg",
            "dimensions": {
                "value": "1080x719",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafybeih5mbslnso2vqqwg5te6lmera4dofhl3s2obip2v7gwusfhsxwypi",
            "mimeType": "image/jpeg",
            "fileName": "cover-burn7.jpg",
            "fileSize": 298544,
            "dimensions": {
                "value": "1024x682",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafkreif47ex4slgngljy23w4ewjbtjdye4spolwalwymcfqzfwiof4heni",
            "mimeType": "image/jpeg",
            "fileName": "thumbnail-burn7.jpg",
            "fileSize": 42760,
            "dimensions": {
                "value": "350x233",
                "unit": "px"
            }
        }
    ],
    "attributes": [
        {
            "key": "ImageCount",
            "value": "1"
        },
        {
            "key": "Format",
            "value": "JPEG"
        },
        {
            "key": "FileSize",
            "value": "308550"
        },
        {
            "key": "StreamSize",
            "value": "0"
        },
        {
            "key": "Format",
            "value": "JPEG"
        },
        {
            "key": "Width",
            "value": "1080"
        },
        {
            "key": "Height",
            "value": "719"
        },
        {
            "key": "ColorSpace",
            "value": "YUV"
        },
        {
            "key": "ChromaSubsampling",
            "value": "4:4:4"
        },
        {
            "key": "BitDepth",
            "value": "8"
        },
        {
            "key": "Compression_Mode",
            "value": "Lossy"
        },
        {
            "key": "StreamSize",
            "value": "308550"
        },
        {
            "key": "extra",
            "value": "{\"ColorSpace_ICC\":\"RGB\"}"
        },
        {
            "key": "@minter",
            "value": "hen-minter v0.0.1"
        },
        {
            "key": "@mediaParser",
            "value": "mediainfo.js"
        }
    ],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### HTML
```json
{
    "name": "title",
    "description": "description",
    "rights": "rights",
    "minter": "KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9",
    "date": "2021-10-06T13:32:29.381Z",
    "tags": [
        "art",
        "3d"
    ],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmVCUUrxi6txMEWZi2qPHjsfUMaYbLdLySA7sA7UcRLEWT",
    "displayUri": "ipfs://QmR4DfQU1sJn7cBquv1X6PFrx7zLo8Usno8SLx8x9Cz3K4",
    "thumbnailUri": "ipfs://QmabrQ7GEZHhCpDPHNHcTZCXzBzMNGXCA9Mp2yH62CLTvc",
    "creators": [
        "tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"
    ],
    "formats": [
        {
            "uri": "ipfs://QmVCUUrxi6txMEWZi2qPHjsfUMaYbLdLySA7sA7UcRLEWT",
            "mimeType": "application/x-directory",
            "fileSize": 5469566,
            "fileName": "HTML.zip"
        },
        {
            "uri": "ipfs://QmR4DfQU1sJn7cBquv1X6PFrx7zLo8Usno8SLx8x9Cz3K4",
            "mimeType": "image/jpeg",
            "fileName": "cover-HTML.jpg",
            "fileSize": 314160,
            "dimensions": {
                "value": "1024x703",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://QmabrQ7GEZHhCpDPHNHcTZCXzBzMNGXCA9Mp2yH62CLTvc",
            "mimeType": "image/jpeg",
            "fileName": "thumbnail-HTML.jpg",
            "fileSize": 46453,
            "dimensions": {
                "value": "350x240",
                "unit": "px"
            }
        }
    ],
    "attributes": [
        {
            "key": "Format",
            "value": "ZIP"
        },
        {
            "key": "FileSize",
            "value": "5469566"
        },
        {
            "key": "StreamSize",
            "value": "5469566"
        },
        {
            "key": "@minter",
            "value": "hen-minter v0.0.1"
        },
        {
            "key": "@mediaParser",
            "value": "mediainfo.js"
        }
    ],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Music
```json
{
    "name": "title",
    "description": "description",
    "rights": "rights",
    "minter": "KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9",
    "date": "2021-10-07T13:53:20.208Z",
    "tags": [
        "mp3",
        "music"
    ],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://bafybeih2kmx7vikra7x5hrfsgd4rdwmkrwh3d3i7gtw37px4rxxqrm6hua",
    "displayUri": "ipfs://bafybeif7n4ifanjra3tlmeixkilqrd6ro66rp24myup4b2jplnlevrupry",
    "thumbnailUri": "ipfs://bafkreihzuhlhxywip27sujaw552tdsgvieb2tdfx2utqx7tpdocmbyicky",
    "creators": [
        "tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"
    ],
    "formats": [
        {
            "uri": "ipfs://bafybeih2kmx7vikra7x5hrfsgd4rdwmkrwh3d3i7gtw37px4rxxqrm6hua",
            "mimeType": "audio/mpeg",
            "fileSize": 3717662,
            "fileName": "tagmp3_audio12.mp3",
            "duration": "00:01:32",
            "dataRate": {
                "value": 320,
                "unit": "kbps"
            }
        },
        {
            "uri": "ipfs://bafybeif7n4ifanjra3tlmeixkilqrd6ro66rp24myup4b2jplnlevrupry",
            "mimeType": "image/jpeg",
            "fileName": "cover-tagmp3_audio12.jpg",
            "fileSize": 266801,
            "dimensions": {
                "value": "1024x682",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafkreihzuhlhxywip27sujaw552tdsgvieb2tdfx2utqx7tpdocmbyicky",
            "mimeType": "image/jpeg",
            "fileName": "thumbnail-tagmp3_audio12.jpg",
            "fileSize": 39873,
            "dimensions": {
                "value": "350x233",
                "unit": "px"
            }
        }
    ],
    "attributes": [
        {
            "key": "AudioCount",
            "value": "1"
        },
        {
            "key": "Format",
            "value": "MPEG Audio"
        },
        {
            "key": "FileSize",
            "value": "3717662"
        },
        {
            "key": "Duration",
            "value": "92.813"
        },
        {
            "key": "OverallBitRate_Mode",
            "value": "CBR"
        },
        {
            "key": "OverallBitRate",
            "value": "320000"
        },
        {
            "key": "StreamSize",
            "value": "4096"
        },
        {
            "key": "Title",
            "value": "Title"
        },
        {
            "key": "Album",
            "value": "Album"
        },
        {
            "key": "Track",
            "value": "Title"
        },
        {
            "key": "Track_Position",
            "value": "1"
        },
        {
            "key": "Performer",
            "value": "Artist"
        },
        {
            "key": "Genre",
            "value": "Pop"
        },
        {
            "key": "Recorded_Date",
            "value": "2021"
        },
        {
            "key": "Encoded_Library",
            "value": "LAME3.100"
        },
        {
            "key": "Comment",
            "value": "Comments"
        },
        {
            "key": "Format",
            "value": "MPEG Audio"
        },
        {
            "key": "Format_Version",
            "value": "1"
        },
        {
            "key": "Format_Profile",
            "value": "Layer 3"
        },
        {
            "key": "Format_Settings_Mode",
            "value": "Joint stereo"
        },
        {
            "key": "Duration",
            "value": "92.813"
        },
        {
            "key": "BitRate_Mode",
            "value": "CBR"
        },
        {
            "key": "BitRate",
            "value": "320000"
        },
        {
            "key": "Channels",
            "value": "2"
        },
        {
            "key": "SamplesPerFrame",
            "value": "1152"
        },
        {
            "key": "SamplingRate",
            "value": "44100"
        },
        {
            "key": "SamplingCount",
            "value": "4093056"
        },
        {
            "key": "FrameRate",
            "value": "38.281"
        },
        {
            "key": "FrameCount",
            "value": "3553"
        },
        {
            "key": "Compression_Mode",
            "value": "Lossy"
        },
        {
            "key": "StreamSize",
            "value": "3712522"
        },
        {
            "key": "StreamSize_Proportion",
            "value": "0.99862"
        },
        {
            "key": "Encoded_Library",
            "value": "LAME3.100"
        },
        {
            "key": "@minter",
            "value": "hen-minter v0.0.1"
        },
        {
            "key": "@mediaParser",
            "value": "mediainfo.js"
        }
    ],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Video
```json
{
    "name": "title",
    "description": "description",
    "rights": "rights",
    "minter": "KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9",
    "date": "2021-10-07T13:55:19.264Z",
    "tags": [
        "mp4",
        "video"
    ],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://bafybeig2a57yq4lpnmvsfcyg3ed6qtgawcacygdgng7bm2p4nfqlbrbaeq",
    "displayUri": "ipfs://bafybeigikaagc7b7e5eyd52fbb3wjo2th45ao7x72v2nvgn24thzmkceai",
    "thumbnailUri": "ipfs://bafkreienkhw4olbhu7cywiw6amdemwe4knlameju5iog4wuue2qjti34ge",
    "creators": [
        "tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"
    ],
    "formats": [
        {
            "uri": "ipfs://bafybeig2a57yq4lpnmvsfcyg3ed6qtgawcacygdgng7bm2p4nfqlbrbaeq",
            "mimeType": "video/mp4",
            "fileSize": 5525125,
            "fileName": "exerciselovehandles.mp4"
        },
        {
            "uri": "ipfs://bafybeigikaagc7b7e5eyd52fbb3wjo2th45ao7x72v2nvgn24thzmkceai",
            "mimeType": "image/jpeg",
            "fileName": "cover-exerciselovehandles.jpg",
            "fileSize": 314160,
            "dimensions": {
                "value": "1024x703",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafkreienkhw4olbhu7cywiw6amdemwe4knlameju5iog4wuue2qjti34ge",
            "mimeType": "image/jpeg",
            "fileName": "thumbnail-exerciselovehandles.jpg",
            "fileSize": 46453,
            "dimensions": {
                "value": "350x240",
                "unit": "px"
            }
        }
    ],
    "attributes": [
        {
            "key": "VideoCount",
            "value": "1"
        },
        {
            "key": "AudioCount",
            "value": "1"
        },
        {
            "key": "Format",
            "value": "MPEG-4"
        },
        {
            "key": "Format_Profile",
            "value": "Base Media"
        },
        {
            "key": "CodecID",
            "value": "isom"
        },
        {
            "key": "CodecID_Compatible",
            "value": "isom/iso2/avc1/mp41"
        },
        {
            "key": "FileSize",
            "value": "5525125"
        },
        {
            "key": "Duration",
            "value": "60.523"
        },
        {
            "key": "OverallBitRate",
            "value": "730317"
        },
        {
            "key": "FrameRate",
            "value": "25.000"
        },
        {
            "key": "FrameCount",
            "value": "1512"
        },
        {
            "key": "StreamSize",
            "value": "35289"
        },
        {
            "key": "HeaderSize",
            "value": "35281"
        },
        {
            "key": "DataSize",
            "value": "5489844"
        },
        {
            "key": "FooterSize",
            "value": "0"
        },
        {
            "key": "IsStreamable",
            "value": "Yes"
        },
        {
            "key": "Encoded_Application",
            "value": "Lavf57.83.100"
        },
        {
            "key": "StreamOrder",
            "value": "0"
        },
        {
            "key": "ID",
            "value": "1"
        },
        {
            "key": "Format",
            "value": "AVC"
        },
        {
            "key": "Format_Profile",
            "value": "High"
        },
        {
            "key": "Format_Level",
            "value": "3"
        },
        {
            "key": "Format_Settings_CABAC",
            "value": "Yes"
        },
        {
            "key": "Format_Settings_RefFrames",
            "value": "4"
        },
        {
            "key": "CodecID",
            "value": "avc1"
        },
        {
            "key": "Duration",
            "value": "60.480"
        },
        {
            "key": "BitRate",
            "value": "600000"
        },
        {
            "key": "Width",
            "value": "640"
        },
        {
            "key": "Height",
            "value": "360"
        },
        {
            "key": "Stored_Height",
            "value": "368"
        },
        {
            "key": "Sampled_Width",
            "value": "640"
        },
        {
            "key": "Sampled_Height",
            "value": "360"
        },
        {
            "key": "PixelAspectRatio",
            "value": "1.000"
        },
        {
            "key": "DisplayAspectRatio",
            "value": "1.778"
        },
        {
            "key": "Rotation",
            "value": "0.000"
        },
        {
            "key": "FrameRate_Mode",
            "value": "CFR"
        },
        {
            "key": "FrameRate_Mode_Original",
            "value": "VFR"
        },
        {
            "key": "FrameRate",
            "value": "25.000"
        },
        {
            "key": "FrameCount",
            "value": "1512"
        },
        {
            "key": "ColorSpace",
            "value": "YUV"
        },
        {
            "key": "ChromaSubsampling",
            "value": "4:2:0"
        },
        {
            "key": "BitDepth",
            "value": "8"
        },
        {
            "key": "ScanType",
            "value": "Progressive"
        },
        {
            "key": "StreamSize",
            "value": "4763564"
        },
        {
            "key": "Encoded_Library",
            "value": "x264 - core 152 r2854 e9a5903"
        },
        {
            "key": "Encoded_Library_Name",
            "value": "x264"
        },
        {
            "key": "Encoded_Library_Version",
            "value": "core 152 r2854 e9a5903"
        },
        {
            "key": "Encoded_Library_Settings",
            "value": "cabac=1 / ref=3 / deblock=1:0:0 / analyse=0x3:0x113 / me=hex / subme=7 / psy=1 / psy_rd=1.00:0.00 / mixed_ref=1 / me_range=16 / chroma_me=1 / trellis=1 / 8x8dct=1 / cqm=0 / deadzone=21,11 / fast_pskip=1 / chroma_qp_offset=-2 / threads=11 / lookahead_threads=1 / sliced_threads=0 / nr=0 / decimate=1 / interlaced=0 / bluray_compat=0 / constrained_intra=0 / bframes=3 / b_pyramid=2 / b_adapt=1 / b_bias=0 / direct=1 / weightb=1 / open_gop=0 / weightp=2 / keyint=250 / keyint_min=25 / scenecut=40 / intra_refresh=0 / rc_lookahead=40 / rc=abr / mbtree=1 / bitrate=600 / ratetol=1.0 / qcomp=0.60 / qpmin=0 / qpmax=69 / qpstep=4 / ip_ratio=1.40 / aq=1:1.00"
        },
        {
            "key": "Language",
            "value": "en"
        },
        {
            "key": "extra",
            "value": "{\"CodecConfigurationBox\":\"avcC\"}"
        },
        {
            "key": "StreamOrder",
            "value": "1"
        },
        {
            "key": "ID",
            "value": "2"
        },
        {
            "key": "Format",
            "value": "AAC"
        },
        {
            "key": "Format_AdditionalFeatures",
            "value": "LC"
        },
        {
            "key": "CodecID",
            "value": "mp4a-40-2"
        },
        {
            "key": "Duration",
            "value": "60.523"
        },
        {
            "key": "BitRate_Mode",
            "value": "CBR"
        },
        {
            "key": "BitRate",
            "value": "96000"
        },
        {
            "key": "Channels",
            "value": "2"
        },
        {
            "key": "ChannelPositions",
            "value": "Front: L R"
        },
        {
            "key": "ChannelLayout",
            "value": "L R"
        },
        {
            "key": "SamplesPerFrame",
            "value": "1024"
        },
        {
            "key": "SamplingRate",
            "value": "48000"
        },
        {
            "key": "SamplingCount",
            "value": "2905104"
        },
        {
            "key": "FrameRate",
            "value": "46.875"
        },
        {
            "key": "FrameCount",
            "value": "2837"
        },
        {
            "key": "Compression_Mode",
            "value": "Lossy"
        },
        {
            "key": "StreamSize",
            "value": "726272"
        },
        {
            "key": "StreamSize_Proportion",
            "value": "0.13145"
        },
        {
            "key": "Language",
            "value": "en"
        },
        {
            "key": "Default",
            "value": "Yes"
        },
        {
            "key": "AlternateGroup",
            "value": "1"
        },
        {
            "key": "@minter",
            "value": "hen-minter v0.0.1"
        },
        {
            "key": "@mediaParser",
            "value": "mediainfo.js"
        }
    ],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Animated GIF
```json
{
    "name": "title",
    "description": "description",
    "rights": "rights",
    "minter": "KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9",
    "date": "2021-10-07T13:59:00.147Z",
    "tags": [
        "art",
        "3d"
    ],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://bafkreifp4ysczckmnqnm5j227h6fkzzno56olitd3gca7l2pid75vq3yva",
    "displayUri": "ipfs://bafybeiai22bkylyjsuiftw6qcm3afnf45qgh3blxvvddeu6gcntnh3edqm",
    "thumbnailUri": "ipfs://bafybeihkdp56jj6qg36rytrzczg3ifddauec5gizihg6jfb2wciv23fafi",
    "creators": [
        "tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"
    ],
    "formats": [
        {
            "uri": "ipfs://bafkreifp4ysczckmnqnm5j227h6fkzzno56olitd3gca7l2pid75vq3yva",
            "mimeType": "image/gif",
            "fileSize": 230515,
            "fileName": "animatedgif.gif",
            "dimensions": {
                "value": "1000x1000",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafybeiai22bkylyjsuiftw6qcm3afnf45qgh3blxvvddeu6gcntnh3edqm",
            "mimeType": "image/jpeg",
            "fileName": "cover-animatedgif.jpg",
            "fileSize": 1324052,
            "dimensions": {
                "value": "1000x1000",
                "unit": "px"
            }
        },
        {
            "uri": "ipfs://bafybeihkdp56jj6qg36rytrzczg3ifddauec5gizihg6jfb2wciv23fafi",
            "mimeType": "image/jpeg",
            "fileName": "thumbnail-animatedgif.jpg",
            "fileSize": 329109,
            "dimensions": {
                "value": "350x350",
                "unit": "px"
            }
        }
    ],
    "attributes": [
        {
            "key": "ImageCount",
            "value": "1"
        },
        {
            "key": "Format",
            "value": "GIF"
        },
        {
            "key": "FileSize",
            "value": "230515"
        },
        {
            "key": "Format",
            "value": "GIF"
        },
        {
            "key": "Format_Profile",
            "value": "89a"
        },
        {
            "key": "Width",
            "value": "1000"
        },
        {
            "key": "Height",
            "value": "1000"
        },
        {
            "key": "Compression_Mode",
            "value": "Lossless"
        },
        {
            "key": "@minter",
            "value": "hen-minter v0.0.1"
        },
        {
            "key": "@mediaParser",
            "value": "mediainfo.js"
        }
    ],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

## Hic Et Nunc Marketplace
### Image
```json
{
    "name": "Bright-0x01",
    "description": "Abstract digital 3D design created with Blender By NoRulesJustFeels\n5/5 | 6144 x 6144 PNG | 2021",
    "tags": ["PORTRAIT", "POLYGON", "CG", "COMPLEX", "DIGITAL", "ART", "WIREFRAME", "GEONODES", "FOSS", "ABSTRACT", "BLACKANDWHITE", "MONOCHROME", "3D", "BLENDER", "@NoRulesJustFeels"],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmaxtU8q1AeELrhbvqbLKxygfWJapgK3ceLBbZr5RqAdKV",
    "displayUri": "ipfs://QmSs19BMtxcq7E1LjGj1xBGHScHnNUPp83UJz28wX1sdQP",
    "thumbnailUri": "ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc",
    "creators": ["tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"],
    "formats": [{ "uri": "ipfs://QmaxtU8q1AeELrhbvqbLKxygfWJapgK3ceLBbZr5RqAdKV", "mimeType": "image/png" }],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### HTML
```json
{
    "name": "norulesjustfeels :: Procedural Symbols #290/1000",
    "description": "Created by tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj on 28 August 2021 at 4:12:00 PM :: Generated procedurally at art-o-matic.xyz",
    "tags": ["Sh!g", "art-o-matic", "proceduralart"],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmameE36rwswxEQCf6UV53kqsopD3Tprtv6km9rG1UPzHy?seed=norulesjustfeels",
    "displayUri": "ipfs://QmefCrY23k7gyEWRkC32AtH3urSgrALm9M67sAMcAyERW3",
    "thumbnailUri": "ipfs://QmefCrY23k7gyEWRkC32AtH3urSgrALm9M67sAMcAyERW3",
    "creators": ["tz1XtjZTzEM6EQ3TnUPUQviCD6WfcsZRHXbj"],
    "formats": [{
        "uri": "ipfs://QmameE36rwswxEQCf6UV53kqsopD3Tprtv6km9rG1UPzHy?seed=norulesjustfeels",
        "mimeType": "application/x-directory"
    }],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Music
```json
{
    "name": "Healing for the soul",
    "description": "I hope that with the creation of this song, those of you who collect this song can respond to this song by filling in your voice or adding the instrument you want.",
    "tags": ["music", "audio", "sound", "nft", "nftaudio", "nftmusic", "nftsound", "visualart", "art", "3d", "objkt", "objkt4objkt", "nftune"],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmSxaMGEjnZfrsXZjvTeZvrjrj8fmVuHj9DQGZYxDTcFFt",
    "displayUri": "ipfs://QmSHeCfdB68jeL9K1gsJAA68eaPGuiqyYzrdVqo3KX56WF",
    "thumbnailUri": "ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc",
    "creators": ["tz1RT8TpaoPXPucwL9yapV8CxGzVbico1UaS"],
    "formats": [{ "uri": "ipfs://QmSxaMGEjnZfrsXZjvTeZvrjrj8fmVuHj9DQGZYxDTcFFt", "mimeType": "audio/mpeg" }],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Video
```json
{
    "name": "wg-01",
    "description": "yay cloth sims",
    "tags": ["cg", "3d", "b3d", "foss", "loop", "perfectloop"],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmQUYNp9CGybfCQE9nx9WU4ZQTLf5jByPNA7rrqhMhRezZ",
    "displayUri": "",
    "thumbnailUri": "ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc",
    "creators": ["tz1aunwuNJkx8HnuZ9KcJjVs372NekSvrJKU"],
    "formats": [{ "uri": "ipfs://QmQUYNp9CGybfCQE9nx9WU4ZQTLf5jByPNA7rrqhMhRezZ", "mimeType": "video/mp4" }],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```

### Animated GIF
```json
{
    "name": "FIRE IN HELL",
    "description": "Have you ever watched a house burn?\nThis is the scariest sight in the world.\n\nSomeone's hopes and comfort - everything that a person loved and took care of - disappears without any meaning.\n\nJust think about it! \nThe fire that Prometheus stole from the gods burned Giordano Bruno.\n\nFire has no conscience.",
    "tags": ["soul", "fire", "hell", "red", "black", "white", "death", "building", "moon"],
    "symbol": "OBJKT",
    "artifactUri": "ipfs://QmPA8mdfebnrP9y4g36tuc27KPXyCejKorHp55oLCcwanD",
    "displayUri": "ipfs://QmPA8mdfebnrP9y4g36tuc27KPXyCejKorHp55oLCcwanD",
    "thumbnailUri": "ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc",
    "creators": ["tz1ePSjwH41f5LZMtKKFHhY41QA7ixBLAhq3"],
    "formats": [{ "uri": "ipfs://QmPA8mdfebnrP9y4g36tuc27KPXyCejKorHp55oLCcwanD", "mimeType": "image/gif" }],
    "decimals": 0,
    "isBooleanAmount": false,
    "shouldPreferSymbol": false
}
```
