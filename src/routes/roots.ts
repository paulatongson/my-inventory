import { Router, Request, Response } from "express";
import { CronJob } from "cron";
import { exeQuery } from "../database/mssql";

interface Artworks {
  Name?: string;
  Description?: string;
  ImgName?: string;
}

interface RequestBodyContactUs extends Request {
  body: {
    Name: string;
    Subject: string;
    MobileNumber: string;
    EmailAdd: string;
    Comments: string;
  };
}

const router = Router();

async function fetchArtworks(): Promise<Artworks> {
  try {
    const fetchArtworksFromDB =
      await exeQuery(` SELECT TOP 1 * FROM Products WHERE CategoryID = 7
    ORDER BY NEWID() `);
    const { recordset } = fetchArtworksFromDB;

    if (recordset.length === 0) {
      return {
        Name: undefined,
        Description: undefined,
        ImgName: undefined,
      };
    }
    return recordset[0];
  } catch (error) {
    return {
      Name: undefined,
      Description: undefined,
      ImgName: undefined,
    };
  }
}

let artworks: Artworks = {
  Name: undefined,
  Description: undefined,
  ImgName: undefined,
};

fetchArtworks().then((res) => {
  artworks = res;
});

selectRandomFromArtworks();

router.get("/", async (req, res) => {
  if (artworks.ImgName === undefined) {
    artworks = await fetchArtworks();
  }

  const featuredArtwork = artworks;

  res.render("index", {
    featuredArtwork: featuredArtwork,
  });
});

router.post("/", async (req: RequestBodyContactUs, res: Response) => {
  const { Name, Subject, MobileNumber, EmailAdd, Comments } = req.body;
  const response = await exeQuery(`
  INSERT INTO  ContactUs ( Name, Subject, MobileNumber, EmailAdd, Comments)  
  values ('${Name}', '${Subject}', '${MobileNumber}', '${EmailAdd}', '${Comments}')
  `);
  if (response.rowsAffected.length > 0) {
    res.status(201).send();
  }
  res.status(202).send();
});

async function selectRandomFromArtworks() {
  new CronJob(
    "0 0 0 * * MON",
    async () => {
      fetchArtworks().then((res) => {
        artworks = res;
      });
    },
    null,
    true,
    "Asia/Manila"
  );
}

export { router };
