//   ______ ______           _____           _       _     //
//  |  ____|  ____|   /\    / ____|         (_)     | |    //
//  | |__  | |__     /  \  | (___   ___ ____ _ ____ | |_   //
//  |  __| |  __|   / /\ \  \___ \ / __|  __| |  _ \| __|  //
//  | |    | |____ / ____ \ ____) | (__| |  | | |_) | |    //
//  |_|    |______/_/    \_\_____/ \___|_|  |_|  __/| |    //
//                                            | |   | |    //
//                                            |_|   | |_   //
//       Website: https://feascript.com/             \__|  //

/**
 * Function to handle version information and fetch the latest update date and release from GitHub
 */
export async function printVersion() {
  // Fetch the latest release information
  const releaseResponse = await fetch("https://api.github.com/repos/FEAScript/FEAScript/releases/latest");
  const releaseData = await releaseResponse.json();
  console.log(`FEAScript version: ${releaseData.tag_name} - ${releaseData.name}`);

  // Fetch the latest commit date
  //const commitResponse = await fetch('https://api.github.com/repos/FEAScript/FEAScript/commits/main');
  //const commitData = await commitResponse.json();
  //const latestCommitDate = new Date(commitData.commit.committer.date).toLocaleString();
  //console.log(`Latest FEAScript update: ${latestCommitDate}`);
}
