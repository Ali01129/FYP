# Improving upon previous 27th Nov, 2024
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def detection(csv_path):
    # Read CSV file
    print("\tDetecting Collisions")
    print(f"\tReading file from {csv_path}")
    df = pd.read_csv(csv_path)
    print("\tFile Read!")
    # Remove Zeros
    df = df[(df['X'] != 0) & (df['Y'] != 0)]
    
    frames = df['Frame'].tolist()
    y = df['Y'].tolist()
    x = df['X'].tolist()

    delta_x = np.diff(x)
    delta_y = np.diff(y)

    # Initialize a list to store collision data
    collision_data = []
    cols = []

    collisions = 0
    count = 0
    for f in range(1, len(frames) - 1):
        if (y[f - 1] <= y[f] and y[f] > y[f + 1]): # peaks
            # Calculate velocity using 4 previous frames
            st = f - 5
            d_vy = 0
            d_vx = 0
            t = 0
            vy = 0
            vx = 0
            if(st >= 0):
                for i in range(st, f):
                    d_vy += y[i + 1] - y[i]
                    d_vx += x[i + 1] - x[i]
                    t += frames[i + 1] - frames[i]
                vy = d_vy / t
                vx = d_vx / t
            collisions += 1
            collision_data.append({"Collision": collisions, "Frame": frames[f], "Type": "NA"})
            cols.append(frames[f])
            #print("Collision: ", collisions, "Frame: ", frames[f], "Velocity Y: ", vy, "Velocity X: ", vx)
        # elif (y[f + 1] - y[f] >= 300): 
        #     collisions += 1
        #     collision_data.append({"Collision": collisions, "Frame": frames[f], "Type": "NA"})
        # elif count >= 2 and (x[f - 1] < x[f] and x[f] > x[f + 1]):
        #     collisions += 1
        #     collision_data.append({"Collision": collisions, "Frame": frames[f], "Type": "NA"})
        # elif (y[f - 1] > y[f] and y[f] <= y[f + 1]) and (x[f - 1] < x[f] and x[f] > x[f + 1]):
        #     collisions += 1
        #     collision_data.append({"Collision": collisions, "Frame": frames[f], "Type": "NA"})

    #print(len(collision_data))


    # collisions = [500 if frame in cols else 0 for frame in frames]  # Replace 'collision_frames' with your list

    # Convert collision data to a DataFrame
    collision_df = pd.DataFrame(collision_data)
    return collision_df

    # Save to CSV
    # collision_df.to_csv('match_42_col_pred.csv', index=False)

    print("Collision data saved to 'match_42_col_pred.csv'")
    """
    Plot X and Y positions with Frame as the x-axis
    plt.figure(figsize=(10, 6))
    plt.plot(df['Frame'], df['X'], color='blue', label='X Coordinate')
    plt.plot(df['Frame'], df['Y'], color='red', label='Y Coordinate')

    plt.step(df['Frame'], collisions, where='post', label='Collision', color='green', alpha=0.5)

    plt.scatter(df['Frame'], df['X'], color='blue', label='X Coordinate')
    plt.scatter(df['Frame'], df['Y'], color='red', label='Y Coordinate')

    # Set the origin at the top left
    plt.gca().invert_yaxis()  # Inverts the y-axis to make the origin at the top

    plt.xlabel('Frame')
    plt.ylabel('Coordinate Value')
    plt.legend()
    plt.title('X and Y Positions with Origin at Top Left')
    plt.grid(True)
    plt.show()
    """
