export interface GalleryItem {
  id: string;
  title: string;
  category: "cuts" | "colors" | "styling" | "bridal" | "grooming" | "studio";
  categoryLabel: string;
  image: string;
  aspect: "square" | "tall" | "wide";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "item-1",
    title: "Signature Precision Cut",
    category: "cuts",
    categoryLabel: "Precision Cuts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5aWP3fxxkHPKBG1iSTHDQtCORjkqQf08QLPxG1soa8UxGMGAgM-is3lASI5SFj5jcr9DzTmUoW2Gi0UJfNi28wQJrRk7uM_Ph5FGd0_--63NWupNKG2YBnPffPTEXsf0hIKMfsx2SmETowEgKh7YozgUMdheB-KOzadqthUybV0gjRXFt1sAucYfvI5i4KdYpjmrzABJrkqPUAAklzuyXf9gdX38OGKcLFPq07hORSy_hNX35dzCj-7GTlDbCveziqIE91sViFh0",
    aspect: "tall",
  },
  {
    id: "item-2",
    title: "Textured Volume",
    category: "styling",
    categoryLabel: "Editorial Styling",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqIpO-ijNnKdpYEIMjP1Rmuu_L-TP3313Fl-9aKqiouBK77HCJA-yrmHnRWNU1e88W6rSLevzrE14VnZDWZkofsuQaJPw2CgF8N_9jgxl1cAw7mCO4V8aFRwMenWxHuyTydJ8eyfqaOyr5O-1KQeZoSoIbK1lkP4ggQ-t-T4qbbUK4Bii6Ug4UXLxyE5XGxfYsgcDYE_3AdgFCB6R9vjKnYtKdyYHKxRX_oLiG6DZ8Yp-5bl7Mp9oFPS92zBmpqTQddPyZrTOcCnw",
    aspect: "tall",
  },
  {
    id: "item-3",
    title: "Royal Bridal Braids",
    category: "bridal",
    categoryLabel: "Bridal Styling",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyUUic5Tu2j1-pZee28--EOFbRM0hP0rAenCoG1RcUU8fF4R8rdz0LCjGv0mLrUczebDdmNQydPkq_TZ3tEIJwvAEjEjIPQRjclE7zQZGEBvdlMn5uyVAtNOJTyIHTtg2CNNyyJjqMA_uLy-UGhxZ0JPK3lRf_gscGHz2L18hBzCParXpXPfD_8_ZBAx_seT-H0WCfkrx0WlTjCC_RyRjKjHzh6TxTMtPTo5CD6auYxaEOvl4z3akz-6O1pb6o9ifae3J1BtCgbaM",
    aspect: "tall",
  },
  {
    id: "item-4",
    title: "Classic Refinement Cut",
    category: "cuts",
    categoryLabel: "Precision Cuts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB-CU6oyQNHYj5mjJo3xDXFCAwMTx8U1zFwBfMiCRHTkDKN0xj0_7iJNR_4IQxWWk-4ft3soZNcpUi9guA9Xkwc_L929MKjBylrh5eBul6jelzXkb3BUag9noNP2dZXnTyKHjeuxi4YHZNSu3UFuJp78-YQzSCBxDWwz3PPwmbuM5kBnkXaVVI82xwCDtBZwFeWJkgvpNXpwGJ-xcvrD1nfRUjOsb2woUCIChxwhNdOmbWhnE7bD3Ufl65GEc9CuAyot4ASKPIbgM",
    aspect: "square",
  },
  {
    id: "item-5",
    title: "Razor Precision Grooming",
    category: "grooming",
    categoryLabel: "Grooming Heritage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjdx8sYgFBU6jMVoNKIL7EuOhtGMQ2y5zxeFKhoYE4tm_EAVN_C49zRUce8mv5ltAPrkrZXhSiKTUu2aSQstIi0uoWsHFLQO6DpuyeiOkcVRmmhNOaUaMT1jY_omCXic6KUAf0p_7BKaFY61KK483mqBxWI9bsuFLWue9JrY3uUxbUKOul6-vHo-7M5po7PpdGh_KOpv63gzvCnJTgk_RTx1LglpvcdZtNmMsu0Bfxz1u5vOlv1snGvXPNpj_48qE7z51G8SVW1E4",
    aspect: "square",
  },
  {
    id: "item-6",
    title: "Geometric Color Art",
    category: "colors",
    categoryLabel: "Advanced Coloring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDog8l6xWWLTJiVpXeAkcf1Al6P9vxYWfQpnSzWuEnnmvbGui7JyqeAwKcFsjY0S3b9ofJ3hBvmdfc8i-yhWBgBBqmkJ-_gsHRRGuhq_TRyjeqme7LrrWwZc8DNY3QoU9wXn5ZB0t3zz5Y0sGHNPEJb37B5Hv_zUrAFX5qbqwj9vStbBsYZwDSaC_tsP3NKCkITibtVEZyNYn7bJ_gKkvXnWiK3H17cnhx-HcJZcMmCk3BWuKBkgnl97oIR5Kp9CK11FEKZ_sRq1jE",
    aspect: "square",
  },
  {
    id: "item-7",
    title: "Elite Beard Sculpting",
    category: "grooming",
    categoryLabel: "Grooming Heritage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD23LboQhhW-UO7kHP7bkGjhXajMkMb4CO4ov13qumAUt_H7CUnwDs7ZuC8ixTx4BIy4gaJnOZj-p_dZJtbqvPFvuPC51bhWF0cup9ghYlBe97C-vZOoFGvY5DkkmFb1lGIL85K0Rmlr3KztLEEJMVTSc0grpMjTBC57A1-zXmXPr1zWYVPJBMyni373mTMVz2G1fnWen1zDgHj0qepr55Y0LmgqR6_a2Ra8enkMs1rKDnaGEpwWtgfCSNTs4qC1UVN7jInIEOJ86w",
    aspect: "tall",
  },
  {
    id: "item-8",
    title: "Modern Matte Texture",
    category: "styling",
    categoryLabel: "Editorial Styling",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClARbpHFnwO2nUaN5Kjeq7zOY_Nfw6iYmgRYVYmRtf7_VWyyzChSGAsKYpFZ1FMkCrfFvmEu7qZZQmu3uQKf7KZ52ToEDRftXn86XTqbiplK9a3quFHUTevXu36Q3W42QoID2attXYOUWqncJY1ISF2eunwOhsRW8CNvP_NNw18cWF63VtRgxUMN58W7f9vImuo54PYDjf5uYXvi62cS7D1NrPCI5ZUm_qRsqbstTPiktYmsTKp9fkGinK1BapTN6Mwki1bAI-qpc",
    aspect: "square",
  },
  {
    id: "item-9",
    title: "The Atelier Sanctuary",
    category: "studio",
    categoryLabel: "Our Studio",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJlSzSUW6JeSjo6L5GyUd5G85h8GQDPOd4iC7LKNHA7sbLh9cIisAevq_OF7OvZxcoZDvwhDp6-LC8j67m-fj2wSeUX-sNNpKhvaQf5fzk89q8BO04ebJIkI-xCTiHavtv2d-szvSwGTXAR3l3R3kDZxhlNprgZI667bRsXFDaiFdWROlRa9WvVeyJlCSxxbTI5w9gKHiyYGd-9MYTtUkS4bVwYRmZEGjdyDJqSIcva8hbrr2W1T5aiARCH9V_pRlOibhhDVZQvM",
    aspect: "tall",
  }
];

export interface BeforeAfterItem {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
}

export const transformations: BeforeAfterItem[] = [
  {
    id: "trans-1",
    title: "Signature Pompadour Transformation",
    description: "Full volume redesign, hair texturing, and sharp temple fade.",
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwG9AioRBKZkcYzmOzRmW7aDgi6Ur3vOvj5X6A5BXi0qMXceWV5j9IXwaT_XuV2EAtGE7T140KxXMJN46isQx_pPUzloT4bu626U6AuiKd2E-9qkB39V4FnuUBL8BN8Z40tuEHfnKSXcstwqF2uVjnF4ENaBckfoFPatOtDboaLDPZ5qvYOXZU7KU--HbjzjwG-l1osvyS7uryajaw_KUaoRGVMc19YuyJ25wV_V7YHOBYwYKe8sTsyCO5ebtSeey6iAaxVaC5nPA",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuBowznbSvls8WwbaA_i73BuePK3S8nJqtLMH1BCKWLfCC3X3ewbxxEgFMjZMM2qzem47Tgb1-5ovVkL3igbMJmjRal8oVDvKNKM4upY_2AMGWqeijtZlPJf8KTibCwKLPHNYwyMPYHntZig49fu3kjxQLpBEWJwDjmhDQ3L7GoNorsMu_PC31HS8R5F9nHrMC-79M4qW-S9YgmRxczSWb6OqN8FtsBf0qGjeVDUYqcMNltXePoCO29BxzZkpGlOw5s3rcbrWHIAAbk",
  },
  {
    id: "trans-2",
    title: "Prestige Bridal Makeover",
    description: "Intricate updo and curl framing decorated with gold accents.",
    before: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS0k_YAYIfNfoGle1bzpPQ6EYi-sz8q2ty_BBpbFd5Ul_RWnEQXU2wd87pjNoqMFCsuc1UAnMwRr6Pmemniv-WzTPrcsOX2qzZsXV9BrtmruoLApNCP1D9NLRCDdIK0aYR09lEECX8qxvD82HdhVxJkYQiqCrWtoWL8T6PK6Rm9MtZotb9g6LGV7kPVpnUSKN8t3l-KO4U03uMn8wlSRhO-_ECNGTOrmnpqOxHab7mEYH_tw4BSQ0btV09LRKtY8sPoI0LZ8kSoUI",
    after: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVq4Y62vE-E3_UJ-4Gu4CvMzLQyMVA3mswB7njY3vhjG4bZnPab4wV7w1hL2ZxiQrFpYgiWfc1cuWG2dfax05MpfRzXjG7uUXgMkwsEjQ-xBn8xubalJPr03bZ2U5Wm9Pp-7bp5hFBIxzxNeF26ux4pHqF-cspwFFOMX1cZOu3DoK_G4j9m_K1J2V-iZL4XS3mVpCvlk2fj3wfKRKrGp_Lpl6OVUAHdp5IV-qgzZQYvEl1vxhhwmJdsRuC37XiwWwwlyExZDr58Co",
  }
];

export interface VideoReel {
  id: string;
  title: string;
  category: string;
  image: string;
  videoUrl?: string;
}

export const videoReels: VideoReel[] = [
  {
    id: "reel-1",
    title: "The Sculpting Process",
    category: "BEHIND THE SCENES",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUNTEmNx_TfnOaZ59C1nMuYRKLbF49ePS2BIWPlh8bvrSY5a99Vr2wSjNPDBkItjioDMdhprNuovJFti9rRJUuxuVM9E5TQAXXEzGN8_lpFucMfGdGdfqnjIsSP4EMwtzBqrB-aGARaq8ADk3bidYECNi-k8W8o4b4k8l54JXQCjzZhbfS8pV8hl30d6uOnjEpYJ87KnRjtleQHYxMhLxnOAHHVGTL1r-Cn_Lb0pIJGI0R4CJp2v9P2-iqU49nYrJWYdr8xfoFMLs",
  },
  {
    id: "reel-2",
    title: "Client Reveal & Reaction",
    category: "TESTIMONIAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-BJlyqaWeyNKXe1wDiI13vpBgvArbzugu6uKaOZ9QHQzyEYq4lXhoXVBVOYHe5yH_LVsWyZpFmRBH0BeU_NrUQEtvT4qPMH8jPexnvNoUHXu_n21xSVNTBMOmagLJHhfH1F3Kp-SgQjsQNL4Dx28C8oMFxP3WblJGFl21vuUrv4qg9ANOj6gfHpWUXV1w5LCoOjfZiOQOo5Kp0eTUf7ro4Flk9Yg0J4J8L787LmN1e4zUCweP8L-s2rZXAjFNYe4V-kR9uM6T-9Y",
  },
  {
    id: "reel-3",
    title: "Scissor Handling Tutorials",
    category: "EDUCATION",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-N14MOlKaAbdxRT_l1OwtmW2BaQXgx903p9OGv2Wv7HXHep6mdJ56-26sKuW2o49nY2NTUrYwJbbaIuA4SetWKLJpubDn1C-RGoWn8VPFNLDHv7-bCHDYEZkWSXlsTNrEFnw07XrSYQeqriDTbHWXkf5pfgmKV963Zx3TeAFEFTpl3tBLKGmPmxyx08T6CzQX6pHaKlnoV1hnMjwKgGOql1Y_Q1ADDwaiqNYm1rM59pbu2tEQBff24dnQ-4UjcHAn-BA0XTeoBoo",
  }
];

export const instagramPosts = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDe2IiBIckzxqZOSOwCpeOV3XC5aZ8skl5EazzAhFcAv-gywKRqv51U9C1O8v1G2zkpDuwEIap-xXQM2f7PZd8ilMm2RZJ-QFyHhU9ADMW3I0iV_iqsQsMEDOoTj1MJ4aaCcSq9kDIRDv7nT5zTIV2lDmQSGYVj644hcrsdVsCu9zQGV8ZO9uPFfqKxZD-_rLN457hpGge-0Q8WbbqcV1xLHABtYlchJrqFIIOMkDyZy3TSxKDmMUP8KZKguaRxNM3IVNzQYxYpxNk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlzE0zU-O1itRruuwEZANooq9yeAB2I2K8RBfcefLO-DWZ7Y_0vNtlao811sILbmRwmk2yShE1sYLL39BQ-w46QDnHlQdM6tpvrCT1C1ftObBdJj54fYDFiN2_IpE5QhRZMzW82Rav623_3t_4fwkKMfZZpwt6C5jKZIF9UVBnrvMq5htH4xiFuQk9EJH-6RD1Ay1NJulfeXOG7V5d43p3ole2yRqCWAh2pvGwsX8QtgUk-B2fjZzb2mXdkPGK_KfMbXslMSzzwU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Ok72uPZtecVqeaL2jq3f30s5_EIcEO70WWR2ZfLqeZ40YXeqUjOb0HxYtzqyj6yBkooDBoN2ksdY0ym_jLCYn-9ZKBoIR7Duk8oLMb31fNnzgIM_2-g9iZx3_K33j4K2jQVl1f47w19Y1p4bEK173Yfus49E0a1KSaAohaDNUV_8RlXOczJZ6eneYTNTCsu6UyqO5_fKG55yxyeZCDX7pP4wdN4O25-5BtNI1p6v8cYP07F6jy4DWY8GZxEa2c6UsUcJ2bn21r4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBV2libQmoOetHt1RUOovLAx-jRMxXBFf2adDDw7w8PhUuuixgQDMytwBZplv5Pf2Tl9hCln7cj13WjWFm01rRrlsiF_ftxDTF0Mqm-uQif_DDqn6YpV7uCxycVMdZ9mvf0nOG3yf4QvmL6jS01XXCJlue0KHzv7uDzS8aEOe0LZW2FR4OPVaTLYmvEmXZE2TFivUODKW2LuSdZ-y_T4ct9nApwba_6ysvmbcQMH0gnnQdJ8USj4I4zTvYkf_qECMFeaBhSox5mSDc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCk6YK762vRkLAzhiwxqx8fZG0HfJs-durioD7_YV7SFXY_LGY2sCvVKAB9I592hEJZVBM-Gjbc--HkdiZdog-aLGzvsZkJ_PbAJyHIWa5YU7LQvGX1YHw3cUDwZALpvTPrF0yZnmXpSi8_Gyo8Xjut06akOYPgmAEXmdnHVyv9CAqgLg0X4Pcw68g-oG1g4WeiLLeCWIAxxBwXCRLk-YqORVNIIlFm8r0VxSgyZcqWimp3SA6xrflml6iJYKp9IrsSPyK05DIEA2Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAHkcjn0bQ-toAm3JCCn03BaVJ59RO5vDLkynxJdCBctWOm7qIT-Hj9J23N6ZiGJLl5iY9WrWOI7tJFXQLc1Pj3drtngNpxNUjTlBhmMOrWUzfK6xF4zSOpcAFi2S8w_30QcVPoouuMeQSk4PsV9J_0NrLxvAKLKVpV60PcJV5JAgWJtHQ229ILtQ_qWNejqtFvp2JW0K7cP6dHHYfxV3Y2OVdogwxfXnzTlhr-S0Ie95Fjqz1tM_AJLxilPKAPYiyV46Zt7OedNGw"
];
